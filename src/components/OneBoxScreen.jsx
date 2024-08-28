import React, { useEffect, useState, useCallback } from 'react';
import { fetchEmails, deleteEmail, sendReply } from '../api/onebox';
import { FaTrash, FaReply, FaBolt, FaEye, FaFont, FaLink, FaPhotoVideo, FaSmile, FaMoon, FaSun } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faInbox, faUser } from '@fortawesome/free-solid-svg-icons';
import '../styles/OneBoxScreen.css';
import '../styles/ConfirmationModal.css'; 
import LogoL from '../images/LogoL.jpeg';
import BackL from '../images/BackL.jpeg';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../components/ConfirmationModal'; 

const OneBoxScreen = () => {
    const [emails, setEmails] = useState([]);
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
    const [replyDetails, setReplyDetails] = useState({
        to: '',
        from: '',
        subject: '',
        body: '',
    });
    const [isInboxVisible, setIsInboxVisible] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // New state for confirmation modal
    const [emailToDelete, setEmailToDelete] = useState(null); 
    const [activities, setActivities] = useState([]); 

    const navigate = useNavigate();

    useEffect(() => {
        fetchEmails()
            .then(response => {
                setEmails(response.data.data);
            })
            .catch(error => {
                console.error('Error fetching emails:', error);
            });
    }, []);

    useEffect(() => {
        setActivities([
            { id: 1, action:'Logged in', timestamp: new Date().toLocaleString() },
            { id: 2, action:'Viewed email from shaw@getmeetings.com', timestamp: new Date().toLocaleString() },
            { id: 3, action:'Replied to email with subject "Meeting Reminder"', timestamp: new Date().toLocaleString() },
        ]);
    }, []);

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to log out?')) {
            localStorage.removeItem('authToken');
            navigate('/ReachInbox-Assignment');
        }
    };

    const handleInboxToggle = () => {
        setIsInboxVisible(prevState => !prevState);
    };

    const handleDeleteClick = useCallback((event, threadId) => {
        event?.stopPropagation();
        setEmailToDelete(threadId);
        setIsConfirmModalOpen(true); // Open confirmation modal
    }, []);

    const handleConfirmDelete = useCallback(() => {
        if (emailToDelete) {
            deleteEmail(emailToDelete)
                .then(() => {
                    setEmails(emails.filter(email => email.threadId !== emailToDelete));
                    if (selectedEmail && selectedEmail.threadId === emailToDelete) {
                        setSelectedEmail(null);
                    }
                    setIsConfirmModalOpen(false); // Close confirmation modal
                })
                .catch(error => {
                    console.error('Error deleting email:', error);
                    setIsConfirmModalOpen(false); // Close confirmation modal on error
                });
        }
    }, [emails, emailToDelete, selectedEmail]);

    const handleCancelDelete = () => {
        setIsConfirmModalOpen(false); // Close confirmation modal
    };

    const handleReplyClick = useCallback((email) => {
        setReplyDetails({
            to: email.fromEmail,
            from: 'mitrajit2022@gmail.com',
            subject: `Re: ${email.subject}`,
            body: '',
        });
        setIsReplyModalOpen(true);
    }, []);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (!isReplyModalOpen && selectedEmail) {
                if (event.key === 'd') {
                    handleDeleteClick(null, selectedEmail.threadId);
                } else if (event.key === 'r') {
                    handleReplyClick(selectedEmail);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedEmail, handleDeleteClick, handleReplyClick, isReplyModalOpen]);

    const handleEmailClick = (email) => {
        setSelectedEmail(prev => (prev && prev.id === email.id ? null : email));
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setReplyDetails(prevDetails => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleSendReply = () => {
        if (!selectedEmail) {
            alert('No email selected for reply');
            return;
        }

        const { to, from, subject, body } = replyDetails;
        const replyData = {
            toName: selectedEmail.fromName || 'Unknown',
            to,
            from,
            fromName: 'Mitrajit',
            subject,
            body,
            references: [selectedEmail.messageId || ''],
            inReplyTo: selectedEmail.messageId || '',
        };

        console.log('Sending reply with data:', replyData);

        sendReply(selectedEmail.threadId, replyData)
            .then(response => {
                console.log('Reply sent successfully:', response);
                setEmails(prevEmails => prevEmails.map(email =>
                    email.threadId === selectedEmail.threadId
                        ? { ...email, replies: [...(email.replies || []), response.newReply] }
                        : email
                ));
                setIsReplyModalOpen(false);
                setReplyDetails({
                    to: '',
                    from: '',
                    subject: '',
                    body: '',
                });
            })
            .catch(error => {
                console.error('Error sending reply:', error);
            });
    };

    const getSubjectPreview = (subject) => {
        const words = subject.split(' ').slice(0, 5).join(' ');
        return words;
    };

    const handleThemeToggle = () => {
        setIsDarkMode(prevMode => !prevMode);
    };

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    return (
        <div className="onebox-container">
            {/* Top Navbar */}
            <div className="top-navbar">
                <h2>OneBox</h2>
                <h5 style={{marginLeft : '1200px'}}>Ajith's Workspace</h5>
                <button className="theme-toggle-button" onClick={handleThemeToggle}>
                    {isDarkMode ? <FaSun /> : <FaMoon />}
                </button>
            </div>

            {/* Sidebar */}
            <div className="left-sidebar">
                <div className="sidebar-icon1">
                    <img src={LogoL} alt="Logo" width={40} />
                </div>
                <div className="sidebar-icon2">
                    <FontAwesomeIcon icon={faHome} />
                </div>
                <div className="sidebar-icon3" onClick={handleInboxToggle}>
                    <FontAwesomeIcon icon={faInbox} />
                </div>
                <div className="sidebar-icon4">
                    <FontAwesomeIcon icon={faUser} onClick={handleLogout} />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="main-content">
                {isInboxVisible && (
                    <div className="email-list">
                        <h2 style={{marginLeft : 100}}>Inbox</h2>
                        <ul>
                            {emails.map((email) => (
                                <li
                                    key={email.id}
                                    onClick={() => handleEmailClick(email)}
                                    className={selectedEmail?.id === email.id ? 'selected' : ''}
                                >
                                    <div className="email-info">
                                        <strong>{email.fromEmail}</strong>
                                        <p>{getSubjectPreview(email.subject)}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="email-details">
                    {selectedEmail ? (
                        <>
                            <h2>{selectedEmail.subject}</h2>
                            <p><strong>From:</strong> {selectedEmail.fromName} &lt;{selectedEmail.fromEmail}&gt;</p>
                            <p><strong>To:</strong> {selectedEmail.toEmail}</p>
                            <p><strong>CC:</strong> {selectedEmail.cc.join(', ') || 'None'}</p>
                            <p><strong>BCC:</strong> {selectedEmail.bcc.join(', ') || 'None'}</p>
                            <div dangerouslySetInnerHTML={{ __html: selectedEmail.body }} />
                            <div className="email-replies">
                                {(selectedEmail.replies || []).map((reply, index) => (
                                    <div key={index} className="email-reply">
                                        <p><strong>From:</strong> {reply.fromName} &lt;{reply.from}&gt;</p>
                                        <p><strong>Subject:</strong> {reply.subject}</p>
                                        <div dangerouslySetInnerHTML={{ __html: reply.body }} />
                                    </div>
                                ))}
                            </div>
                            <div className="email-actions">
                                <button className="reply-button" onClick={() => handleReplyClick(selectedEmail)}>
                                    <FaReply /> Reply
                                </button>
                                <button className="delete-button" onClick={(e) => handleDeleteClick(e, selectedEmail.threadId)}>
                                    <FaTrash /> Delete
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="no-email-selected">
                            <img src={BackL} alt='BackL'/>
                        </div>
                    )}
                </div>
                <div className="lead-details">
                    <div id='lead'><h3>Lead Details</h3></div>
                    <div className="details">
                        <p>Name:<strong>Ajith</strong></p>
                        <p>Contact No:<strong>+91-9483840704</strong></p>
                        <p>Email ID:<strong>ajithnarayana@gmail.com</strong></p>
                        <p>Linkedin:<strong><a href="https://www.linkedin.com/in/ajithnarayanak/">linkedin.com/in/timvadde/</a></strong></p>
                        <p>Company Name:<strong>Reachinbox</strong></p>
                    </div>
                    <div id='lead1'><h3>Activities</h3></div>
                    <div className="details1">
                        <ul>
                            {activities.map(activity => (
                                <li key={activity.id}>
                                    <p><strong>{activity.action}</strong> - <span>{activity.timestamp}</span></p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Reply Modal */}
            {isReplyModalOpen && (
                <div className="reply-modal">
                    <div className="reply-modal-content">
                        <div className="close-button" onClick={() => setIsReplyModalOpen(false)}>
                            &times;
                        </div>
                        <h3>Reply to {replyDetails.to}</h3>
                        <form>
                            <div className="form-group">
                                <label>To:</label>
                                <input
                                    type="email"
                                    name="to"
                                    value={replyDetails.to}
                                    onChange={handleInputChange}
                                    disabled
                                />
                            </div>
                            <div className="form-group">
                                <label>From:</label>
                                <input
                                    type="email"
                                    name="from"
                                    value={replyDetails.from}
                                    onChange={handleInputChange}
                                    disabled
                                />
                            </div>
                            <div className="form-group">
                                <label>Subject:</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={replyDetails.subject}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Body:</label>
                                <textarea
                                    name="body"
                                    value={replyDetails.body}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="editor-actions">
                                <button type="button" className="editor-icon">
                                    <FaBolt />
                                </button>
                                <button type="button" className="editor-icon variable-button">
                                    <FaEye />
                                </button>
                                <button type="button" className="editor-icon variable-button">
                                    <FaFont />
                                </button>
                                <button type="button" className="editor-icon variable-button">
                                    <FaLink />
                                </button>
                                <button type="button" className="editor-icon variable-button">
                                    <FaPhotoVideo />
                                </button>
                                <button type="button" className="editor-icon variable-button">
                                    <FaSmile />
                                </button>
                            </div>
                            <button type="button" onClick={handleSendReply}>
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                message="Are you sure you want to delete this email?"
            />
        </div>
    );
};

export default OneBoxScreen;
