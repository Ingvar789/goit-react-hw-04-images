// імпорт компонент
import React, { useEffect, useState, useRef } from 'react';
import getImages from 'services/api';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Searchbar from 'components/Searchbar/Searchbar';
import ImageGallery from 'components/ImageGallery/ImageGallery';
import Button from 'components/Button/Button';
import css from './App.module.css';
import { toast } from 'react-toastify';
import Loader from 'components/Loader/Loader';

const App = () => {
  const [pictures, setPictures] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pending, setPending] = useState(false);
  const isFirstRender = useRef(0);
  const handleFormSubmit = searchQuery => {
    setSearchQuery(searchQuery);
  };

  useEffect(() => {
    setPictures([]);
    setPage(1);
  }, [searchQuery]);

  useEffect(() => {
    if (isFirstRender.current < 2) {
      isFirstRender.current += 1;
      return;
    }
    const getResponse = async () => {
      setPending(true);
      try {
        const response = await getImages(searchQuery, page);

        if (response.length !== 0) {
          if (page === 1) {
            setPictures(response);
            return;
          } else {
            setPictures(pictures => [...pictures, ...response]);
          }
          return;
        }
        toast.warning('There are no pictures for your request.');
        return;
      } catch (error) {
        console.log(error);
      } finally {
        setPending(false);
      }
    };
    getResponse();
  }, [searchQuery, page]);

  const incrementPage = () => {
    setPage(page + 1);
  };

  return (
    <div className={css.app}>
      <ToastContainer autoClose={3000} />
      <Searchbar onSubmit={handleFormSubmit} />
      {pictures.length !== 0 && (
        <>
          <ImageGallery pictures={pictures} />{' '}
          {pending ? <Loader /> : <Button onLoadMore={incrementPage} />}
        </>
      )}
    </div>
  );
};

export default App;
