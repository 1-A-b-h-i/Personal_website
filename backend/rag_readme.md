# RAG Assistant Implementation with Gemini 1.5 Flash

This document explains the implementation of the Retrieval-Augmented Generation (RAG) system used in the portfolio website's AI assistant feature.

## Overview

The RAG system uses Google's Gemini 1.5 Flash API to provide intelligent, context-aware responses to user queries about the portfolio owner. The system combines:

1. **Vector Embedding Storage**: Stores embedded chunks of knowledge about the portfolio owner
2. **Semantic Search**: Retrieves the most relevant information based on the user's query
3. **LLM Response Generation**: Uses Gemini 1.5 Flash to generate natural, accurate responses based on retrieved context

## Setup

### Prerequisites

- Python 3.7+
- Google Gemini API key

### Configuration

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Set your Gemini API key in the `.env` file:
   ```
   GOOGLE_API_KEY=your_gemini_api_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   FLASK_SECRET_KEY=your_secret_key_here
   ```

## Components

### 1. Knowledge Base (`knowledge.json`)

A structured JSON file containing comprehensive information about the portfolio owner, including:
- Basic information
- Education
- Skills
- Work experience
- Projects
- Achievements
- Blog posts
- Personal interests
- Languages
- FAQs

### 2. RAG Assistant (`rag_assistant.py`)

Implements the RAG architecture:

- **Document Processing**: Converts the knowledge JSON into text chunks suitable for embedding
- **Vector Storage**: Uses FAISS for efficient similarity search
- **Embeddings**: Uses Gemini's embedding model to create vector representations of text
- **Response Generation**: Retrieves relevant context and generates responses using Gemini 1.5 Flash
- **Conversation History**: Maintains chat history for contextual follow-up responses

### 3. Flask API Integration (`app.py`)

The `/api/chat` endpoint uses the RAG assistant to:
1. Accept user messages
2. Pass them to the RAG system with session ID for conversation continuity
3. Return AI-generated responses

## How It Works

1. **Initialization**:
   - The knowledge data is loaded and processed into text chunks
   - Chunks are embedded and indexed in a vector store

2. **Query Processing**:
   - User query is received via API
   - The query is used to retrieve the most relevant knowledge chunks
   - Retrieved chunks form the context for the LLM

3. **Response Generation**:
   - For the first message, a simple prompt with context is sent to Gemini
   - For follow-up messages, the full conversation history is included
   - Gemini 1.5 Flash generates a natural, accurate response based on the provided context
   - Response is returned to the user and added to conversation history

## Gemini 1.5 Flash Features

The implementation leverages Gemini 1.5 Flash's capabilities:

- **Faster Responses**: Optimized for speed and efficiency compared to larger models
- **Lower Rate Limits**: Better suited for production applications with higher traffic
- **Chat History Support**: Native support for conversation context
- **Markdown Formatting**: Formats responses with proper Markdown

## Customization

To update the knowledge base:
1. Edit the `knowledge.json` file with new information
2. The system will automatically use the updated information on the next startup

To modify the assistant's personality or behavior:
1. Edit the `system_instructions` in the `RAGAssistant` class
2. Adjust temperature and other generation parameters as needed

## Troubleshooting

- **API Key Issues**: Ensure your Gemini API key is correctly set in the `.env` file
- **Import Errors**: Verify all dependencies are installed
- **Generation Errors**: Check Gemini API limits and quotas
- **Embedding Errors**: Ensure text chunks are within the model's token limits 