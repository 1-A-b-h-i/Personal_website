import os
import json
from typing import List, Dict, Any, Optional
import numpy as np
from dotenv import load_dotenv
import google.generativeai as genai
from google.generativeai import types
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_core.documents import Document

# Load environment variables
load_dotenv()

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

class ConversationManager:
    """Manages conversation history for a chat session."""
    
    def __init__(self, max_history: int = 5):
        """
        Initialize a conversation manager.
        
        Args:
            max_history: Maximum number of message pairs to keep in history
        """
        self.history = []
        self.max_history = max_history
        
    def add_exchange(self, user_message: str, ai_response: str):
        """Add a message exchange to the conversation history."""
        self.history.append({"user": user_message, "ai": ai_response})
        
        # Trim history if it exceeds max_history
        if len(self.history) > self.max_history:
            self.history = self.history[-self.max_history:]
    
    def get_chat_history(self) -> List[Dict[str, str]]:
        """Get the conversation history in a format suitable for Gemini API."""
        history = []
        for exchange in self.history:
            history.append({"role": "user", "parts": [{"text": exchange["user"]}]})
            history.append({"role": "model", "parts": [{"text": exchange["ai"]}]})
        return history
    
    def clear(self):
        """Clear the conversation history."""
        self.history = []

class RAGAssistant:
    def __init__(self, knowledge_file: str):
        """
        Initialize the RAG Assistant with a knowledge file.
        
        Args:
            knowledge_file: Path to the JSON file containing knowledge data
        """
        self.knowledge_file = knowledge_file
        self.embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
        self.knowledge_data = self._load_knowledge()
        self.vector_store = self._create_vector_store()
        
        # Initialize Gemini client
        self.client = genai.GenerativeModel(
            model_name="gemini-2.0-flash",  # Using Gemini 2.0 Flash instead of 2.5 Pro
            generation_config={
                "temperature": 0.7,
                "top_p": 0.95, 
                "max_output_tokens": 2048,
            }
        )
        
        # Dictionary to store conversation managers keyed by session_id
        self.conversations = {}
        
        self.system_instructions = """
        You are JARVIS, an advanced AI assistant for Abhinav Paidisetti's personal portfolio website.
        Your purpose is to provide comprehensive, detailed information about Abhinav's background, 
        skills, experience, education, projects, and other professional information ONLY when specifically asked.
        
        Key characteristics of your personality:
        - Professional and precise in your delivery
        - Confident but not boastful
        - Slightly witty and personable when appropriate
        - Thorough and comprehensive in your responses
        - Anticipatory of follow-up questions
        
        CRITICAL RULES:
        1. NEVER list or summarize skills, experiences, or qualifications unless directly asked. 
           Do not preemptively offer to explain skills or provide skill lists.
        2. DO NOT start your responses with lists of information you can provide.
        3. Represent skills accurately according to their prominence in Abhinav's experience.
           Do not overemphasize minor skills like Arduino if they've only been used once.
        4. Never begin with phrases like "Based on the information provided, I can assist you..."
        
        When visitors ask about Abhinav, provide complete and detailed information rather than
        brief or modest answers. Don't hold back on showcasing his accomplishments, but only
        discuss skills and achievements when directly relevant to the question being asked.
        
        Begin conversations with "How may I assist you today?" or similar professional greetings.
        DO NOT immediately suggest topics about Abhinav or offer information categories.

        Be helpful, thorough, and personable in your responses.
        If you don't know something, be honest about it rather than making up information.
        Use a conversational tone that is reminiscent of JARVIS from Iron Man - efficient,
        intelligent, and slightly witty when appropriate.
        
        Use the provided context to answer questions, but feel free to generate natural and
        coherent responses based on the context. You may expand on points in a natural way
        but should not invent major achievements, experiences, or qualifications that aren't 
        mentioned in the provided context.
        
        Pay attention to the conversation history to maintain context across multiple messages.
        Refer back to previous questions when appropriate.
        
        IMPORTANT FORMATTING INSTRUCTIONS:
        Format your responses using Markdown syntax:
        - Use **bold** for emphasis and important points
        - Use *italics* for secondary emphasis
        - Use bullet points and numbered lists when presenting multiple items
        - Use headings (## or ###) for section titles when appropriate
        - Use code formatting (`) for technical terms when relevant
        - Include links when appropriate
        - Structure your responses with clear paragraphs
        """
        
    def _load_knowledge(self) -> Dict[str, Any]:
        """Load knowledge data from JSON file."""
        try:
            with open(self.knowledge_file, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading knowledge data: {e}")
            return {}
            
    def _create_documents(self) -> List[Document]:
        """Convert knowledge data to documents for indexing."""
        documents = []
        
        # Process basic info
        basic_info = self.knowledge_data.get("basic_info", {})
        basic_info_text = f"Abhinav Paidisetti is a {basic_info.get('title')} based in {basic_info.get('location')}. "
        basic_info_text += f"Contact: {basic_info.get('email')}, LinkedIn: {basic_info.get('linkedin')}, "
        basic_info_text += f"GitHub: {basic_info.get('github')}, Website: {basic_info.get('website')}. "
        basic_info_text += f"Summary: {basic_info.get('summary')}"
        documents.append(Document(page_content=basic_info_text, metadata={"source": "basic_info"}))
        
        # Process education
        for idx, edu in enumerate(self.knowledge_data.get("education", [])):
            edu_text = f"Education: {edu.get('degree')} from {edu.get('school')} in {edu.get('location')} ({edu.get('period')}). "
            edu_text += f"Achievements: {', '.join(edu.get('achievements', []))}"
            documents.append(Document(page_content=edu_text, metadata={"source": f"education_{idx}"}))
        
        # Process skills
        skills = self.knowledge_data.get("skills", {})
        for skill_type, skill_list in skills.items():
            skill_text = f"{skill_type.replace('_', ' ').title()}: {', '.join(skill_list)}"
            documents.append(Document(page_content=skill_text, metadata={"source": f"skills_{skill_type}"}))
        
        # Process experience
        for idx, exp in enumerate(self.knowledge_data.get("experience_details", [])):
            exp_text = f"Experience: {exp.get('title')} at {exp.get('company')} in {exp.get('location')} ({exp.get('period')}). "
            exp_text += f"Description: {exp.get('description')} "
            exp_text += f"Achievements: {', '.join(exp.get('achievements', []))}. "
            exp_text += f"Technologies used: {', '.join(exp.get('technologies', []))}"
            documents.append(Document(page_content=exp_text, metadata={"source": f"experience_{idx}"}))
        
        # Process projects
        for idx, proj in enumerate(self.knowledge_data.get("projects", [])):
            proj_text = f"Project: {proj.get('name')}. Description: {proj.get('description')} "
            proj_text += f"Technologies: {', '.join(proj.get('technologies', []))}. "
            if "github" in proj:
                proj_text += f"GitHub: {proj.get('github')}. "
            if "live" in proj:
                proj_text += f"Live: {proj.get('live')}. "
            proj_text += f"Highlights: {', '.join(proj.get('highlights', []))}"
            documents.append(Document(page_content=proj_text, metadata={"source": f"project_{idx}"}))
        
        # Process achievements
        for idx, ach in enumerate(self.knowledge_data.get("achievements_details", [])):
            ach_text = f"Achievement: {ach.get('title')} from {ach.get('organization')} ({ach.get('date')}). "
            ach_text += f"Description: {ach.get('description')}"
            documents.append(Document(page_content=ach_text, metadata={"source": f"achievement_{idx}"}))
        
        # Process blog posts
        for idx, blog in enumerate(self.knowledge_data.get("blog_posts_details", [])):
            blog_text = f"Blog Post: {blog.get('title')} ({blog.get('date')}). "
            blog_text += f"Summary: {blog.get('summary')} "
            blog_text += f"Content: {blog.get('content')} "
            blog_text += f"Tags: {', '.join(blog.get('tags', []))}"
            documents.append(Document(page_content=blog_text, metadata={"source": f"blog_post_{idx}"}))
        
        # Process personal interests
        interests_text = f"Personal Interests: {', '.join(self.knowledge_data.get('personal_interests', []))}"
        documents.append(Document(page_content=interests_text, metadata={"source": "personal_interests"}))
        
        # Process languages
        languages_text = "Languages: " + ", ".join([f"{lang.get('name')} ({lang.get('proficiency')})" 
                                                  for lang in self.knowledge_data.get("languages", [])])
        documents.append(Document(page_content=languages_text, metadata={"source": "languages"}))
        
        # Process FAQs
        for idx, faq in enumerate(self.knowledge_data.get("faqs", [])):
            faq_text = f"Question: {faq.get('question')} Answer: {faq.get('answer')}"
            documents.append(Document(page_content=faq_text, metadata={"source": f"faq_{idx}"}))
        
        return documents
    
    def _create_vector_store(self) -> FAISS:
        """Create a vector store from knowledge documents."""
        documents = self._create_documents()
        
        # Split documents into smaller chunks for better retrieval
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
        )
        
        chunked_documents = text_splitter.split_documents(documents)
        
        # Create vector store
        return FAISS.from_documents(chunked_documents, self.embeddings)
    
    def _get_conversation_manager(self, session_id: str) -> ConversationManager:
        """Get or create a conversation manager for the given session."""
        if session_id not in self.conversations:
            self.conversations[session_id] = ConversationManager()
        return self.conversations[session_id]
    
    def get_response(self, user_message: str, session_id: str = "default") -> str:
        """
        Generate a response to the user's message using RAG with conversation history.
        
        Args:
            user_message: The user's query
            session_id: Unique identifier for the conversation session
            
        Returns:
            Response text
        """
        try:
            # Get conversation manager for this session
            conversation = self._get_conversation_manager(session_id)
            
            # Enhance query with keywords if asking about specific topics
            enhanced_query = user_message
            if any(keyword in user_message.lower() for keyword in ["project", "projects", "work", "experience", "job"]):
                if "project" in user_message.lower() or "projects" in user_message.lower():
                    enhanced_query = f"{user_message} Abhinav projects ML Prediction Computer Vision LLM Personal Portfolio"
                if "work" in user_message.lower() or "experience" in user_message.lower() or "job" in user_message.lower():
                    enhanced_query = f"{user_message} Abhinav work experience SDE Intern Wizcom Research Intern IIT Tech Mahindra ML Coordinator SALVO"
            
            # Retrieve relevant context based on the query - increase k for more comprehensive answers
            relevant_docs = self.vector_store.similarity_search(enhanced_query, k=6)
            context = "\n\n".join([doc.page_content for doc in relevant_docs])
            
            # Check if we need more specific content for projects or experience
            if any(keyword in user_message.lower() for keyword in ["project", "projects"]):
                project_docs = []
                for idx, proj in enumerate(self.knowledge_data.get("projects", [])):
                    proj_text = f"Project: {proj.get('name')}. Description: {proj.get('description')} "
                    proj_text += f"Technologies: {', '.join(proj.get('technologies', []))}. "
                    if "github" in proj and proj.get('github'):
                        proj_text += f"GitHub: {proj.get('github')}. "
                    if "live" in proj and proj.get('live'):
                        proj_text += f"Live: {proj.get('live')}. "
                    proj_text += f"Highlights: {', '.join(proj.get('highlights', []))}"
                    project_docs.append(proj_text)
                
                if project_docs:
                    context += "\n\nAdditional Project Information:\n" + "\n\n".join(project_docs)
            
            if any(keyword in user_message.lower() for keyword in ["work", "experience", "job"]):
                exp_docs = []
                for idx, exp in enumerate(self.knowledge_data.get("experience_details", [])):
                    exp_text = f"Experience: {exp.get('title')} at {exp.get('company')} in {exp.get('location')} ({exp.get('period')}). "
                    exp_text += f"Description: {exp.get('description')} "
                    exp_text += f"Achievements: {', '.join(exp.get('achievements', []))}. "
                    exp_text += f"Technologies used: {', '.join(exp.get('technologies', []))}"
                    exp_docs.append(exp_text)
                
                if exp_docs:
                    context += "\n\nAdditional Work Experience Information:\n" + "\n\n".join(exp_docs)
            
            # Prepare prompt with context and query
            prompt = f"""
            {self.system_instructions}
            
            Use the following context to answer the user's question. 
            If you can't find the answer in the context, say you don't have that information.
            
            Context:
            {context}
            
            User's message: {user_message}
            """
            
            # Create conversation history for Gemini
            history = conversation.get_chat_history()
            
            # If there's history, use it for the chat completion
            if history:
                # Add system instructions first
                messages = [{"role": "user", "parts": [{"text": self.system_instructions}]},
                            {"role": "model", "parts": [{"text": "I understand. I'll act as Abhinav's AI assistant, providing helpful and accurate information based on the content you provide. I'll format my responses using Markdown for better readability."}]}]
                
                # Add conversation history
                messages.extend(history)
                
                # Add the current query with context
                messages.append({
                    "role": "user", 
                    "parts": [{"text": f"""Based on this context:
                    
                    {context}
                    
                    Please answer this question (remember to use Markdown formatting): {user_message}"""}]
                })
                
                # Generate response
                response = self.client.generate_content(messages)
                ai_response = response.text
            else:
                # For the first message in a conversation, just use the prompt
                response = self.client.generate_content(prompt)
                ai_response = response.text
            
            # Add this exchange to conversation history
            conversation.add_exchange(user_message, ai_response)
            
            return ai_response
            
        except Exception as e:
            print(f"Error generating response: {e}")
            return "I'm having trouble processing your request right now. Please try again later."
    
    def clear_conversation(self, session_id: str = "default"):
        """Clear the conversation history for a session."""
        if session_id in self.conversations:
            self.conversations[session_id].clear()

# Initialize assistant (singleton instance)
assistant = None

def get_assistant():
    """Get or create the RAG assistant."""
    global assistant
    if assistant is None:
        knowledge_file = os.path.join(os.path.dirname(__file__), 'knowledge.json')
        assistant = RAGAssistant(knowledge_file)
    return assistant

def get_response(message: str, session_id: str = "default") -> str:
    """Get a response from the RAG assistant."""
    return get_assistant().get_response(message, session_id)

def clear_conversation(session_id: str = "default"):
    """Clear a conversation session."""
    get_assistant().clear_conversation(session_id) 