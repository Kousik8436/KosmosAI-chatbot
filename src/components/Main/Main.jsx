import React, { useContext, useRef } from 'react'
import './Main.css'
import { assets } from '../../assets/assets'
import { Context } from '../../context/Context'

function Main() {
    const { onSent, recentPrompt, showResult, loading, resultData, setInput, input, setUploadedFileContent, uploadedFile, setUploadedFile, darkMode, setDarkMode } = useContext(Context);
    const fileInputRef = useRef(null);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            
            if (file.type.startsWith('image/')) {
                reader.onload = (e) => {
                    const imageData = e.target.result;
                    setUploadedFileContent(`Image file: ${file.name}`);
                    setUploadedFile({ name: file.name, type: 'image', data: imageData });
                };
                reader.readAsDataURL(file);
            } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
                reader.onload = (e) => {
                    const textContent = e.target.result;
                    setUploadedFileContent(textContent);
                    setUploadedFile({ name: file.name, type: 'text', data: textContent });
                };
                reader.readAsText(file);
            } else {
                setUploadedFile({ name: file.name, type: 'document', data: null });
                setUploadedFileContent(`Document file: ${file.name}`);
            }
        }
    };

    const removeFile = () => {
        setUploadedFile(null);
        setUploadedFileContent("");
    };

    const openFileDialog = () => {
        fileInputRef.current.click();
    };

    return (
        <div className={`main ${darkMode ? 'dark' : ''}`}>
            <div className="nav">
                <p>KosmosAI</p>
                <div className="nav-right">
                    <div className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
                        <div className={`toggle-slider ${darkMode ? 'dark' : ''}`}>
                            <span className="toggle-icon">{darkMode ? '🌙' : '☀️'}</span>
                        </div>
                    </div>
                    <img src={assets.user_icon} alt="User icon" />
                </div>
            </div>
            <div className="main-container">
                {!showResult ? (
                    <>
                        <div className="greet">
                            <p><span>Hello, User</span></p>
                            <p>How can I help you today?</p>
                        </div>

                    </>
                ) : (
                    <div className='result'>
                        <div className="result-title">
                            <img src={assets.user_icon} alt="User icon" />
                            <p>{recentPrompt}</p>
                        </div>
                        <div className="result-data">
                            <img src="/kosmos-logo.svg" alt="KosmosAI icon" />
                            {loading ? (
                                <div className='loader'>
                                    <hr className="animated-bg" />
                                    <hr className="animated-bg" />
                                    <hr className="animated-bg" />
                                </div>
                            ) : (
                                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
                            )}
                        </div>
                    </div>
                )}
                <div className="main-bottom">
                    <div className="search-box">
                        {uploadedFile && (
                            <div className="file-preview">
                                <div className="file-info">
                                    <span className="file-name">{uploadedFile.name}</span>
                                    <button onClick={removeFile} className="remove-file">×</button>
                                </div>
                            </div>
                        )}
                        <input
                            onChange={(e) => setInput(e.target.value)}
                            value={input}
                            type='text'
                            placeholder={uploadedFile ? `Ask about ${uploadedFile.name}` : 'Ask KosmosAI'}
                            onKeyPress={(e) => e.key === 'Enter' && input && onSent()}
                        />
                        <div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt"
                                style={{ display: 'none' }}
                            />
                            <img onClick={openFileDialog} src={assets.gallery_icon} alt="Upload file" style={{ cursor: 'pointer' }} />
                            <img src={assets.mic_icon} alt="Microphone icon" />
                            {input && <img onClick={() => onSent()} src={assets.send_icon} alt="Send icon" />}
                        </div>
                    </div>
                    <p className="bottom-info">
                        © 2025 Kousik. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Main