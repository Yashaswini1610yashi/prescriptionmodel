import streamlit as st
import google.generativeai as genai
from PIL import Image
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv(".env.local")

# Configure Google Gemini
API_KEY = os.getenv("GOOGLE_API_KEY")

if not API_KEY:
    st.error("Missing Google API Key. Please configure it in .env.local or Streamlit Secrets.")
    st.stop()

genai.configure(api_key=API_KEY)

# Function to get Gemini response
def get_gemini_response(prompt, image=None):
    model = genai.GenerativeModel('gemini-1.5-flash')
    if image:
        response = model.generate_content([prompt, image])
    else:
        response = model.generate_content(prompt)
    return response.text

# Page Config
st.set_page_config(page_title="Med-Scan AI", page_icon="💊", layout="wide")

# Sidebar
with st.sidebar:
    st.image("https://img.icons8.com/color/96/medical-mobile-app.png", width=80)
    st.title("Med-Scan AI")
    st.write("Your Personal Health Assistant")
    
    selected = st.radio("Navigation", ["Dashboard", "Prescription Scanner", "AI Chatbot", "Emergency Profile", "Symptom Checker"])

# Dashboard State
if 'history' not in st.session_state:
    st.session_state.history = []

if selected == "Dashboard":
    st.header("Welcome to Med-Scan AI 👋")
    st.info("Navigate using the sidebar to access AI health tools.")
    
    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric(label="Scans Performed", value=len(st.session_state.history))
    with col2:
        st.metric(label="Emergency Contact", value="Set" if os.getenv("DOCTOR_NAME") else "Not Set")
    with col3:
        st.metric(label="Health Status", value="Good")

elif selected == "Prescription Scanner":
    st.header("📄 AI Prescription & Drug Scanner")
    st.write("Upload an image of a medication or prescription to analyze it.")
    
    uploaded_file = st.file_uploader("Choose an image...", type=["jpg", "jpeg", "png"])
    
    if uploaded_file is not None:
        image = Image.open(uploaded_file)
        st.image(image, caption="Uploaded Image", use_column_width=True)
        
        if st.button("Analyze Image"):
            with st.spinner("Analyzing..."):
                prompt = """
                Analyze this medical image (prescription or medication).
                Identify:
                1. Medication Name
                2. Dosage/Usage
                3. Purpose (What it treats)
                4. Side Effects (Brief)
                5. warnings (If any)
                Format the output clearly.
                """
                response = get_gemini_response(prompt, image)
                st.success("Analysis Complete")
                st.markdown(response)
                st.session_state.history.append({"type": "scan", "content": response})

elif selected == "AI Chatbot":
    st.header("💬 Health Assistant Chat")
    
    if "messages" not in st.session_state:
        st.session_state.messages = []

    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])

    if prompt := st.chat_input("Ask a health question..."):
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)

        with st.chat_message("assistant"):
            with st.spinner("Thinking..."):
                response = get_gemini_response(prompt)
                st.markdown(response)
                st.session_state.messages.append({"role": "assistant", "content": response})

elif selected == "Emergency Profile":
    st.header("🚨 Emergency Profile")
    
    with st.form("doctor_form"):
        d_name = st.text_input("Doctor Name", value="Dr. Smith")
        d_phone = st.text_input("Emergency Phone", value="+1234567890")
        d_email = st.text_input("Doctor Email", value="dr.smith@example.com")
        
        submitted = st.form_submit_button("Save Profile")
        if submitted:
            st.success("Profile Saved Locally!")

    st.warning("In case of emergency, press the button below.")
    if st.button("🔴 Call Doctor Now"):
        st.markdown(f"**Dialing {d_phone}...**")

elif selected == "Symptom Checker":
    st.header("monitor Symptoms")
    symptoms = st.text_area("Describe your symptoms:")
    if st.button("Analyze Symptoms"):
        if symptoms:
            with st.spinner("Analyzing..."):
                resp = get_gemini_response(f"I have these symptoms: {symptoms}. What could be the cause and home remedies? Disclaimer: You are an AI, advise to see a doctor.")
                st.markdown(resp)
        else:
            st.error("Please enter symptoms.")
