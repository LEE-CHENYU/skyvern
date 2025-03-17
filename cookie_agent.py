import asyncio
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

from browser_use import Agent
from browser_use.browser.browser import Browser, BrowserConfig
from browser_use.browser.context import BrowserContext, BrowserContextConfig

# Load environment variables
load_dotenv()

async def custom_agent_with_button_click():
    # Create browser configuration
    browser_config = BrowserConfig(
        headless=False  # Set to True in production
    )
    
    # Create browser instance
    browser = Browser(config=browser_config)
    
    # Create browser context with highlighting enabled
    context = BrowserContext(
        browser=browser, 
        config=BrowserContextConfig(
            highlight_elements=True,
            viewport_expansion=1000,  # Increased to try to include more elements
            cookies_file="temp_cookies.json"  # If you're using cookies
        )
    )
    
    # Define the URL with proper escaping
    job_url = "https://q.yingjiesheng.com/jobdetail/158919526.html?property=%7B%22isInitiative%22%3A%22%E6%98%AF%22,%22keyword%22%3A%22%22,%22isSuggest%22%3A%22%E5%90%A6%22,%22pageCode%22%3A%22search%7Cjobsearch%7Cjobsearchlb%22,%22requestId%22%3A%220340a6b3e79dc63291aae5444a638b04%22,%22policyType%22%3A%22%E6%90%9C%E7%B4%A2%22,%22engineName%22%3A%22searchEngine%22,%22policyId%22%3A%22%7B%7D%22,%22jobSource%22%3A%22%E7%BD%91%E7%94%B3%22,%22jobId%22%3A%22158919526%22,%22jobTitle%22%3A%22%E8%8F%81%E5%8D%8E%E7%94%9F%20%E8%90%A5%E9%94%80%E5%B2%97%EF%BC%88%E6%B5%B7%E5%8D%97%EF%BC%89%22,%22monthSalary%22%3A%2210-12%E4%B8%87%2F%E5%B9%B4%22,%22companyId%22%3A%229119678%22,%22companyName%22%3A%22%E5%A4%A7%E5%8D%8E%EF%BC%88%E9%9B%86%E5%9B%A2%EF%BC%89%22,%22keywordEntityType%22%3A%22%E9%9D%9E%E5%85%AC%E5%8F%B8%E8%AF%8D%22,%22jobRank%22%3A%221%22,%22jobType%22%3A%220%22,%22advId%22%3A%22%22,%22exrInfo02%22%3A%22%7B%5C%22retrieverName%5C%22%3A%5C%22JobTermBasedRetriever%5C%22,%5C%22referJobId%5C%22%3A%5C%22%5C%22,%5C%22intentions%5C%22%3A%5C%22%5C%22,%5C%22adExtendFunc%5C%22%3A%5C%22%5C%22,%5C%22adExtendCity%5C%22%3A%5C%22%5C%22,%5C%22recommendLabel%5C%22%3A%5C%22%5C%22,%5C%22workFuncMixedLabelResultExrInfo%5C%22%3A%5C%22%5C%22,%5C%22commonLabels%5C%22%3A%5C%22%5C%22%7D%22%7D&recommendReasons=%5B%5D"
    
    try:
        # Get a session and navigate to the URL
        session = await context.get_session()
        page = await context.get_current_page()
        
        print(f"Navigating to job listing...")
        await page.goto(job_url)
        
        # Wait for page to load
        await page.wait_for_load_state("networkidle")
        
        # Find and click the apply button directly
        print("Looking for the apply button...")
        
        # Try multiple possible selectors for the button
        apply_button = await page.query_selector('div.delivery-btn')
        if not apply_button:
            apply_button = await page.query_selector('button:has-text("立即申请")')
        if not apply_button:
            apply_button = await page.query_selector('a:has-text("立即申请")')
        if not apply_button:
            # Try a more generic approach
            await page.evaluate("""() => {
                const elements = Array.from(document.querySelectorAll('*'));
                for (const element of elements) {
                    if (element.textContent.trim() === '立即申请') {
                        element.style.border = '3px solid red';
                        element.click();
                        return true;
                    }
                }
                return false;
            }""")
        else:
            print("Apply button found, clicking...")
            await apply_button.click()
        
        # Wait a moment for any redirects or form loads
        await asyncio.sleep(2)
        
        # Now run the agent with further exploration instructions
        agent_task = task = """
    
    Complete the job application by navigating pages and filling the forms one by one with the following information, follow the sequence of the form, not the order of the following json. If encounter any information you don't have and please skip, if you can not skip please report:
    
    {
      "education": [
        {
          "institution": "Columbia University",
          "degree": "Master of Science in Applied Analytics",
          "period": "Sep 2021 - Feb 2023"
        },
        {
          "institution": "Shanghai Jiao Tong University",
          "degree": "Bachelor of Arts in Japanese, Finance",
          "period": "Sep 2017 - Jun 2021",
          "gpa": "3.7/4.0",
          "exchange": {
            "institution": "Waseda University Business School",
            "program": "Exchange Program",
            "period": "Spring 2019"
          }
        }
      ],
      "experience": [
        {
          "company": "VCV Digital",
          "position": "Investment Associate",
          "period": "May 2023 - Present",
          "location": "New York"
        },
        {
          "company": "Guosheng Securities Co., Ltd.",
          "position": "Equity Analyst Intern",
          "period": "Oct 2021 - Dec 2021",
          "location": "Shanghai"
        },
        {
          "company": "Nanjing Securities Co. Ltd.",
          "position": "Investment Banking Analyst Intern",
          "period": "Nov 2020 - Feb 2021",
          "location": "Nanjing"
        },
        {
          "company": "KPMG",
          "position": "Audit Intern",
          "period": "Jan 2020 - Mar 2020",
          "location": "Shanghai"
        }
      ],
      "skills": {
        "technical": [
          "Python for Data Analytics",
          "SQL Data Management",
          "Advanced Excel",
          "Data Visualization",
          "Financial Analysis",
          "Hardware platform selection",
          "Driver development",
          "Terminal product technology protection and distribution"
        ],
        "soft": [
          "Critical Thinking",
          "Analytical Mindset",
          "Contrarian Thinking",
          "Effective Communication",
          "Strong communication skills",
          "Ability to work under pressure"
        ],
        "languages": [
          {"language": "Japanese", "proficiency": "JLPT N1, Fluent"},
          {"language": "English", "proficiency": "IELTS 7.5/7.0 Writing, GRE 330"},
          {"language": "Mandarin Chinese", "proficiency": "Native"}
        ]
      }
    }
    
    Take screenshots of the completed application and report back when finished.
    """
        
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("Please set the OPENAI_API_KEY environment variable")
        
        llm = ChatOpenAI(model="gpt-4o")
        
        agent = Agent(
            browser_context=context,
            task=agent_task,
            llm=llm,
            max_actions_per_step=4
        )
        
        print("Starting agent exploration...")
        result = await agent.run(max_steps=20)
        print(f"Agent completed with result: {result}")
        
    except Exception as e:
        print(f"Error occurred: {e}")
    finally:
        # Keep browser open until user decides to close
        input("Press Enter to close the browser...")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(custom_agent_with_button_click())