import { createContext, useState } from "react";
import runChat from "../config/gemini";
import { getCurrentTime, getCurrentDate, getWeather, getNews, getCryptoPrice } from "../utils/realTimeData";

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [uploadedFileContent, setUploadedFileContent] = useState("");
    const [uploadedFile, setUploadedFile] = useState(null);
    const [darkMode, setDarkMode] = useState(false);

    const delayPara = (index, nextWord) => {
        setTimeout(() => {
            setResultData(prev => prev + nextWord);
        }, 75 * index);
    };

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
        setResultData("");
        setRecentPrompt("");
    };

    const loadChat = (prompt, response) => {
        setRecentPrompt(prompt);
        setResultData(response);
        setShowResult(true);
    };

    const onSent = async (prompt) => {
        setResultData("");
        setLoading(true);
        setShowResult(true);
        
        try {
            let response;
            const currentPrompt = prompt !== undefined ? prompt : input;
            
            // Check for AI identity questions
            if (currentPrompt.toLowerCase().includes('your name') || 
                currentPrompt.toLowerCase().includes('who are you') || 
                currentPrompt.toLowerCase().includes('what is your name') ||
                currentPrompt.toLowerCase().includes('kosmosai')) {
                response = "I am KosmosAI. I made by Kousik Maity.";
            } else if (currentPrompt.toLowerCase().includes('weather')) {
                const city = extractCity(currentPrompt) || 'London';
                const weather = await getWeather(city);
                response = `Current weather in ${weather.city}: ${weather.temperature}°C, ${weather.description}. Humidity: ${weather.humidity}%, Wind: ${weather.windSpeed} km/h`;
            } else if (currentPrompt.toLowerCase().includes('time')) {
                response = `Current time: ${getCurrentTime()}`;
            } else if (currentPrompt.toLowerCase().includes('date')) {
                response = `Today's date: ${getCurrentDate()}`;
            } else if (currentPrompt.toLowerCase().includes('news')) {
                const news = await getNews();
                response = `Latest news:\n${news.map((item, i) => `${i + 1}. ${item}`).join('\n')}`;
            } else if (currentPrompt.toLowerCase().includes('bitcoin') || currentPrompt.toLowerCase().includes('crypto')) {
                const crypto = currentPrompt.toLowerCase().includes('ethereum') ? 'ethereum' : 'bitcoin';
                const price = await getCryptoPrice(crypto);
                response = `${crypto.charAt(0).toUpperCase() + crypto.slice(1)} price: $${price.price.toLocaleString()} (${price.change > 0 ? '+' : ''}${price.change}%)`;
            } else {
                // Regular AI response with file context
                let fullPrompt = currentPrompt;
                if (uploadedFileContent && uploadedFileContent.trim()) {
                    fullPrompt = `Based on the uploaded file content: "${uploadedFileContent}", please answer: ${currentPrompt}`;
                }
                
                if (prompt !== undefined) {
                    response = await runChat(fullPrompt);
                    setRecentPrompt(prompt);
                } else {
                    setPrevPrompts(prev => [...prev, input]);
                    setRecentPrompt(input);
                    response = await runChat(fullPrompt);
                }
            }
            
            if (prompt !== undefined) {
                setRecentPrompt(prompt);
            } else {
                setPrevPrompts(prev => [...prev, input]);
                setRecentPrompt(input);
            }
            
            // Format response like ChatGPT/Gemini
            let formattedResponse = response
                .replace(/```([\s\S]*?)```/g, '<div class="code-block"><pre><code>$1</code></pre></div>') // Code blocks
                .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>') // Inline code
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
                .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic text
                .replace(/\n\n/g, '</p><p>') // Paragraphs
                .replace(/\n/g, '<br>') // Line breaks
                .replace(/^(.*)$/gm, '<p>$1</p>') // Wrap in paragraphs
                .replace(/<p><\/p>/g, '') // Remove empty paragraphs
                .replace(/\d+\./g, '<li>') // Convert numbered lists
                .replace(/<li>/g, '</li><li>') // Fix list items
                .replace(/<\/li><li>/, '<ol><li>') // Start ordered list
                .replace(/(<li>.*<\/li>)/s, '$1</ol>') // End ordered list
                .replace(/- /g, '<li>') // Convert bullet points
                .replace(/<li>/g, '</li><li>') // Fix bullet items
                .replace(/<\/li><li>/, '<ul><li>') // Start unordered list
                .replace(/(<li>.*<\/li>)/s, '$1</ul>'); // End unordered list
            

            
            let newResponseArray = formattedResponse.split(" ");
            
            for (let i = 0; i < newResponseArray.length; i++) {
                const nextWord = newResponseArray[i];
                delayPara(i, nextWord + " ");
            }
            
            // Save to chat history
            setChatHistory(prev => [...prev, {
                id: Date.now(),
                prompt: currentPrompt,
                response: formattedResponse,
                timestamp: new Date().toLocaleTimeString()
            }]);
        } catch (error) {
            console.error("Error:", error);
            let errorMessage = "Sorry, something went wrong. ";
            if (error.message.includes("API key")) {
                errorMessage += "Please check your API key configuration.";
            } else if (error.message.includes("quota")) {
                errorMessage += "API quota exceeded. Please try again later.";
            } else {
                errorMessage += "Please try again.";
            }
            setResultData(errorMessage);
        }
        
        setLoading(false);
        setInput("");
    };

    const extractCity = (prompt) => {
        const words = prompt.toLowerCase().split(' ');
        const inIndex = words.indexOf('in');
        if (inIndex !== -1 && inIndex < words.length - 1) {
            return words[inIndex + 1];
        }
        return null;
    };

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat,
        chatHistory,
        loadChat,
        uploadedFileContent,
        setUploadedFileContent,
        uploadedFile,
        setUploadedFile,
        darkMode,
        setDarkMode
    };
    
    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;