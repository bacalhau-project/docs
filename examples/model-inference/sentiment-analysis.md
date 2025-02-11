# Running Sentiment Analysis on Bacalhau

## 1. Overview
This guide explains how to set up and run a sentiment analysis workload on Bacalhau. The workload fetches text from articles using web scraping, analyzes sentiment using a machine learning model, and provides insights into the overall sentiment of a given topic or individual article.

## 2. Prerequisites
Before you begin, ensure you have the following:

1. **Bacalhau CLI**: Install the Bacalhau client by following the instructions [here](https://docs.bacalhau.org/getting-started/installation).
2. **Docker**: Install Docker [here](https://docs.docker.com/get-docker/).
3. **Google Cloud Account**: Obtain the `API_KEY` and `CX` for Google Custom Search API.
4. **Python 3.8+**: Ensure Python is installed on your system.

## 3. Setting Up the Project

### Folder Structure
Your project directory should look like this:

```plaintext
sentiment-analysis/
├── Dockerfile
├── requirements.txt
├── sentiment_analysis.py
└── .env
```

- **`Dockerfile`**: Defines the Docker image for the project.
- **`requirements.txt`**: Lists the Python dependencies.
- **`sentiment_analysis.py`**: Contains the Python script for sentiment analysis.
- **`.env`**: Stores environment variables like `API_KEY` and `CX`.

### Obtaining API_KEY and CX from Google Cloud
To use Google Custom Search API, you need an `API_KEY` and `CX` (Custom Search Engine ID). Follow these steps:

1. **Go to Google Cloud Console**:
   - Visit [Google Cloud Console](https://console.cloud.google.com/).
   - Create a new project or select an existing one.

2. **Enable Custom Search API**:
   - Navigate to the **API Library**.
   - Search for "Custom Search API" and enable it.

3. **Create API Key**:
   - Go to **Credentials** > **Create Credentials** > **API Key**.
   - Copy the generated `API_KEY`.

4. **Create a Custom Search Engine**:
   - Visit [Programmable Search Engine](https://programmablesearchengine.google.com/about/).
   - Click **Add** and configure your search engine.
   - Under **Sites to Search**, you can specify websites or use `*` to search the entire web.
   - Once created, copy the `CX` (Search Engine ID) from the dashboard.

5. **Store API_KEY and CX in `.env`**:
   Create a `.env` file in your project directory and add the following:

```plaintext
API_KEY=your_google_api_key
CX=your_custom_search_engine_id
```

### requirements.txt
The `requirements.txt` file contains the necessary Python packages:

```plaintext
requests
beautifulsoup4
transformers
nltk
python-dotenv
torch
```

### sentiment_analysis.py
The Python script performs sentiment analysis on articles fetched using Google Custom Search API. Below is the script with comments for clarity:

```python
import requests
from bs4 import BeautifulSoup
from transformers import pipeline
from nltk.tokenize import sent_tokenize
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
API_KEY = os.getenv("API_KEY")
CX = os.getenv("CX")

# Initialize the sentiment analysis model using Hugging Face Transformers.
def initialize_sentiment_model():
    return pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english", device=0)

# Fetch and extract text from a given URL using BeautifulSoup.
def extract_text_from_url(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        paragraphs = soup.find_all('p')
        return ' '.join(paragraph.get_text() for paragraph in paragraphs)
    except requests.exceptions.RequestException as e:
        print(f"Error fetching the URL: {e}")
        return None

# Analyze the sentiment of a given text and calculate the percentage of positive and negative sentences.
def analyze_sentiment_percentage(sentiment_model, text):
    if not text:
        return "No text found to analyze."
    
    sentences = sent_tokenize(text)
    sentiment_results = [sentiment_model(sentence[:512])[0] for sentence in sentences]
    
    positive_count = sum(1 for result in sentiment_results if result['label'] == 'POSITIVE')
    negative_count = sum(1 for result in sentiment_results if result['label'] == 'NEGATIVE')
    total_sentences = len(sentiment_results)
    
    positive_percentage = (positive_count / total_sentences) * 100
    negative_percentage = (negative_count / total_sentences) * 100
    
    overall_sentiment = "POSITIVE" if positive_percentage > negative_percentage else "NEGATIVE"
    
    return {
        "overall_sentiment": overall_sentiment,
        "positive_percentage": positive_percentage,
        "negative_percentage": negative_percentage,
        "total_sentences": total_sentences,
    }

# Search Google using the Custom Search API and return a list of URLs.
def search_google(query):
    search_url = f"https://www.googleapis.com/customsearch/v1?q={query}&key={API_KEY}&cx={CX}"
    response = requests.get(search_url)
    data = response.json()
    return [item['link'] for item in data.get('items', [])]

# Analyze the sentiment of multiple articles related to a given topic.
def analyze_topic(query):
    sentiment_model = initialize_sentiment_model()
    urls = search_google(query)
    total_positive, total_negative, total_sentences = 0, 0, 0
    
    for url in urls:
        article_text = extract_text_from_url(url)
        if article_text:
            results = analyze_sentiment_percentage(sentiment_model, article_text)
            total_positive += (results["positive_percentage"] * results["total_sentences"]) / 100
            total_negative += (results["negative_percentage"] * results["total_sentences"]) / 100
            total_sentences += results["total_sentences"]
    
    return (total_positive / total_sentences) * 100, (total_negative / total_sentences) * 100

def main():
    print("\nChoose an option:")
    print("1. Analyze a single article")
    print("2. Analyze a topic")
    choice = input("\nEnter 1 or 2: ")
    
    if choice == '1':
        url = input("\nEnter the URL of the article: ")
        print(f"\nAnalyzing {url}...")
        sentiment_results = analyze_sentiment_percentage(initialize_sentiment_model(), extract_text_from_url(url))
        print("\n--- Article Sentiment Analysis Results ---")
        print(f"Overall Sentiment: {sentiment_results['overall_sentiment']}")
        print(f"Positive Sentiment: {sentiment_results['positive_percentage']:.2f}%")
        print(f"Negative Sentiment: {sentiment_results['negative_percentage']:.2f}%")
    elif choice == '2':
        query = input("\nEnter the topic to analyze: ")
        print(f"\nAnalyzing information related to '{query}'...")
        combined_positive, combined_negative = analyze_topic(query)
        print("\n--- Topic Sentiment Analysis Results ---")
        print(f"Overall Sentiment: {'POSITIVE' if combined_positive > combined_negative else 'NEGATIVE'}")
        print(f"Overall Positive Sentiment: {combined_positive:.2f}%")
        print(f"Overall Negative Sentiment: {combined_negative:.2f}%")
    else:
        print("Invalid choice. Please enter 1 or 2.")

if __name__ == "__main__":
    main()
```

## 4. Setting Up Docker

### Dockerfile

The following **`Dockerfile`** sets up a Python environment with the required dependencies:

```dockerfile
# Use Python 3.8 as the base image
FROM python:3.8

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file and install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Python script and environment file
COPY sentiment_analysis.py ./
COPY .env ./

# Define the command to run the script
CMD ["python", "sentiment_analysis.py"]
```

## 5. Building and Running the Docker Image

### Build the Docker Image

Navigate to the project directory and run the following command to build the Docker image:

```bash
docker build -t sentiment-analysis:latest .
```

### Push the Docker Image to Docker Hub

1. **Log in to Docker Hub**:
```bash
docker login
```

2. **Tag the Docker image**:
```bash
docker tag sentiment-analysis:latest <your-dockerhub-username>/sentiment-analysis:latest
```

3. **Push the Docker image**:
```bash
docker push <your-dockerhub-username>/sentiment-analysis:latest
```

Replace <your-dockerhub-username> with your Docker Hub username.

## 6. Running the Job on Bacalhau

### Run the Job with Default Parameters

To submit a Bacalhau job using the Docker image, run the following command:
```bash
export JOB_ID=$(bacalhau docker run \
    --id-only \
    --wait \
    --env API_KEY=<your-google-api-key> \
    --env CX=<your-google-custom-search-engine-id> \
    <your-dockerhub-username>/sentiment-analysis:latest)
```

Replace <your-google-api-key> and <your-google-custom-search-engine-id> with your actual Google API key and Custom Search Engine ID. Also, replace <your-dockerhub-username> with your Docker Hub username.

### Run the Job with Custom Parameters
You can also run the job with custom parameters, such as specifying a topic to analyze:
```bash
bacalhau docker run \
    <your-dockerhub-username>/sentiment-analysis:latest \
    -- python sentiment_analysis.py --topic "Artificial Intelligence"
```

## 7. Check the State of your Jobs

### Job Status

To check the status of your job, use the following command:
```bash
bacalhau job list --id-filter ${JOB_ID}
```

### Job Information

To get more details about your job, use:
```bash
bacalhau job describe ${JOB_ID}
```

### Download Job Results

To download the results of your job, use:

```bash
rm -rf results && mkdir -p results
bacalhau job get $JOB_ID --output-dir results
```

### View Job Output

To view the output, run:

```bash
cat results/stdout
```

## Support

If you have questions or need support, reach out to the Bacalhau team via [Slack](https://bacalhauproject.slack.com/ssb/redirect).
