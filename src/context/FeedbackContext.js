import { createContext, useState, useEffect } from 'react';
import FeedbackData from '../data/feedbackData';

const FeedbackContext = createContext();

export const FeedbackProvider = ({ children }) => {
  const [isLoading, setIsloading] = useState(true);
  const [feedback, setFeedback] = useState(FeedbackData);
  const [feedbackEdit, setFeedbackEdit] = useState({
    item: {},
    edit: false,
  });

  useEffect(() => {
    fetchData();
    setIsloading(false);
  }, []);

  async function fetchData() {
    const res = await fetch('/feedback');
    const data = await res.json();
    setFeedback(data);
  }

  async function handleDelete(id) {
    if (window.confirm('Are you sure you want to delete')) {
      await fetch(`/feedback/${id}`, {
        method: 'DELETE',
      });
      setFeedback(feedback.filter((item) => item.id != id));
    }
  }

  async function handleAdd(newFeedback) {
    const res = await fetch('/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newFeedback),
    });
    const data = await res.json();

    setFeedback([data, ...feedback]);
  }

  async function updateFeedback(id, updItem) {
    const res = await fetch(`feedback/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updItem),
    });

    const data = await res.json();

    setFeedback(
      feedback.map((item) => (item.id === id ? { ...item, ...data } : item))
    );
  }

  function editFeedback(item) {
    setFeedbackEdit({
      item,
      edit: true,
    });
  }

  return (
    <FeedbackContext.Provider
      value={{
        feedback,
        feedbackEdit,
        isLoading,
        handleDelete,
        handleAdd,
        editFeedback,
        updateFeedback,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

export default FeedbackContext;
