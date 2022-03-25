import pandas as pd              #for data transformation
import praw                      #to access reddit data
import re                        #for regex on scraped text
import os                        #for operating system interface
from dotenv import load_dotenv   #for loading environment variable 

# Reddit API setup
load_dotenv()
reddit = praw.Reddit(
  client_id = os.environ.get('REDDIT_CLIENT_ID'),
  client_secret = os.environ.get('REDDIT_SECRET'),
  user_agent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:97.0) Gecko/20100101 Firefox/97.0"
)

# Call the reddit API and store the data into a pandas datafrane 
sourceDataList = []
for post in reddit.subreddit('wallstreetbets').hot(limit=550):  
    content = {
    "title" : post.title,
    "text" : post.selftext
    }  
    sourceDataList.append(content)
sourceDF = pd.DataFrame(sourceDataList)

# Analyzing and creating a word frequency map using regex 
regex = re.compile('[^a-zA-Z ]')

wordDict = {}
for (index, row) in sourceDF.iterrows():
    # titles
    title = row['title']
    title = regex.sub('', title)
    title_words = title.split(' ') 
    # content
    content = row['text']
    content = regex.sub('', content)
    content_words = content.split(' ')  
    # combine
    words = title_words + content_words
    for word in words:
        if word in ['A', 'B', 'GO', 'ARE', 'ON'] or len(word) < 3:
              pass

        elif word in wordDict:
              wordDict[word] += 1    
        else:
                wordDict[word] = 1
                wordDF = pd.DataFrame.from_dict(list(wordDict.items()))\
                            .rename(columns = {0:"text", 1:"size"})

# Join the Reddit list of words with the Stock ticker data 
tickerDF = pd.read_csv('./stock-ticker-detail.csv')\
            [["ACT Symbol","Company Name"]]\
            .rename(columns = {"ACT Symbol":"text", "Name":"Company_Name"})

stocksDF = pd.merge(tickerDF, wordDF, on="text")\
            .sort_values(["size", "text","Company Name"], ascending=False)\
            .head(225)\
            [["text","size"]]
            
# Write out the file in json     
out = stocksDF.to_json(orient='records')
with open('stocks_freq.json', 'w') as f:
    f.write(out)