import React, { useState, useContext } from 'react';
import './Sidebar.css';
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';

const Sidebar = () => {
    const [extended, setExtended] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { chatHistory, newChat, loadChat, darkMode } = useContext(Context);

    return (
        <>
        <div className={`sidebar ${darkMode ? 'dark' : ''} ${!extended ? 'collapsed' : ''} ${mobileOpen ? 'open' : ''}`}>
            <div className="top">
                <img onClick={()=>{setExtended(prev=>!prev); setMobileOpen(prev=>!prev);}} className="menu" src={assets.menu_icon} alt='Toggle menu' />
                <div onClick={newChat} className="new-chat">
                    <img src={assets.plus_icon} alt='New chat' />
                    {extended ? <p>New Chat</p> : null}
                </div>
                <div className="recent">
                    {extended ? <p className='recent-title'>Recent</p> : null}
                    {chatHistory.slice(-10).reverse().map((chat) => (
                        <div key={chat.id} onClick={() => loadChat(chat.prompt, chat.response)} className="recent-entry">
                            <img src={assets.message_icon} alt='Chat' />
                            {extended ? <p>{chat.prompt.length > 18 ? chat.prompt.slice(0, 18) + '...' : chat.prompt}</p> : null}
                        </div>
                    ))}
                </div>
            </div>
            <div className="bottom">
                <div className="bottom-item recent-entry">
                    <img src={assets.question_icon} alt='' />
                    {extended ? <p>Help</p> : null}
                </div>
                <div className="bottom-item recent-entry">
                    <img src={assets.history_icon} alt='' />
                    {extended ? <p>Activity</p> : null}
                </div>
                <div className="bottom-item recent-entry">
                    <img src={assets.setting_icon} alt='' />
                    {extended ? <p>Settings</p> : null}
                </div>
            </div>
        </div>
        {mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)}></div>}
        </>
    );
}
export default Sidebar;