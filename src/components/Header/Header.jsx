import { useState, useEffect } from "react";
import styles from "./Header.module.css";
import { Link } from "react-router-dom";
import { useUser } from "../UserContext";
import Modal from "../Modal/Modal";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie"; // Импортируем библиотеку для работы с куками

const Header = () => {
  const { user, logoutUser } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState(null); // Используем useState для хранения userId

  useEffect(() => {
    // При монтировании компонента извлекаем userId из куки
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      try {
        const decodedToken = jwtDecode(accessToken);
        const userIdFromToken = decodedToken["UserId"];
        setUserId(userIdFromToken);
      } catch (error) {
        console.error("Ошибка декодирования токена:", error);
      }
    }
  }, [user]); // Добавляем user в зависимости, чтобы useEffect вызывался при изменении пользователя

  const handleLogout = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  let isAdmin = false;

  if (user && user.encodedJwt) {
    try {
      const decodedToken = jwtDecode(user.encodedJwt);
      isAdmin =
        decodedToken[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] === "Moderator";
    } catch (error) {
      console.error("Ошибка декодирования токена:", error);
    }
  }

  const isLoggedIn = !!user && !!userId; // Проверяем наличие userId

  return (
    <>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          <img src="logo.svg" alt="" className={styles.logoImage} />
          <div>LombNet</div>
        </Link>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            columnGap: "20px",
          }}
        >
          {isAdmin && (
            <Link to="/admin" className={styles.adminLink}>
              <div>Панель администратора</div>
            </Link>
          )}
          {isLoggedIn && (
            <>
              <span>{userId}</span> {/* Отображение userId */}
              <button onClick={handleLogout} className={styles.logout}>
                Мой кабинет
              </button>
            </>
          )}
          {!isLoggedIn && (
            <Link to="/login">
              <button className={styles.login}>Войти</button>
            </Link>
          )}
        </div>
      </header>
      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <div>
            <Link to="/purchase-history">Мои покупки</Link>
            <button
              onClick={() => {
                logoutUser();
                handleCloseModal();
              }}
            >
              Выйти из аккаунта
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Header;
