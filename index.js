// Получаем необходимые элементы из DOM
const postTitleInputNode = document.querySelector('.js-post-title-input');
const postContentInputNode = document.querySelector('.js-post-content-input');
const postPublishBtnNode = document.querySelector('.js-post-publish-btn');
const postDeleteBtnNode = document.querySelector('.js-post-delete-btn');
const feedListNode = document.querySelector('.js-feed');
const titleWarningNode = document.querySelector('.js-title-warning');
const contentWarningNode = document.querySelector('.js-content-warning');
const emptyFeedMessageNode = document.querySelector('.js-empty-feed-message');

// Максимальная длина заголовка и содержания
const maxTitleLength = 100;
const maxContentLength = 200;

// Обработчик события ввода в поле заголовка
postTitleInputNode.addEventListener('input', () => {
  const title = postTitleInputNode.value;
  if (title.length > maxTitleLength) {
    displayWarning(titleWarningNode, 'Заголовок больше 100 символов');
  } else {
    hideWarning(titleWarningNode);
  }
});

// Обработчик события ввода в поле содержания
postContentInputNode.addEventListener('input', () => {
  const content = postContentInputNode.value;
  if (content.length > maxContentLength) {
    displayWarning(contentWarningNode, 'Пост больше 200 символов');
  } else {
    hideWarning(contentWarningNode);
  }
});

// Обработчик события клика на кнопку 'Опубликовать'
postPublishBtnNode.addEventListener('click', () => {
  const title = postTitleInputNode.value;
  const content = postContentInputNode.value;

  // Проверяем заголовок на пустоту и длину
  if (isEmpty(title)) {
    displayWarning(titleWarningNode, 'Заголовок не может быть пустым');
    return;
  } else if (title.length > maxTitleLength) {
    displayWarning(titleWarningNode, 'Заголовок больше 100 символов');
    return;
  } else {
    hideWarning(titleWarningNode);
  }

  // Проверяем содержание поста на пустоту и длину
  if (isEmpty(content)) {
    displayWarning(contentWarningNode, 'Пост не может быть пустым');
    return;
  } else if (content.length > maxContentLength) {
    displayWarning(contentWarningNode, 'Пост больше 200 символов');
    return;
  } else {
    hideWarning(contentWarningNode);
  }

  // Получаем текущую дату и время
  const currentDate = new Date();

  // Сохраняем пост в локальное хранилище вместе с датой и временем публикации
  savePost(title, content, currentDate);

  // Создаем новый элемент списка для отображения поста в ленте
  const listItem = createPostListItem(title, content, currentDate);

  // Добавляем новый элемент списка в начало ленты
  prependToFeedList(feedListNode, listItem);

  // Сбрасываем значения полей ввода
  resetInputFields(postTitleInputNode, postContentInputNode);

  // Скрываем сообщение 'Тут пока что пусто...'
  hideEmptyFeedMessage(emptyFeedMessageNode);
});

// Обработчик события клика на кнопку 'Очистить историю'
postDeleteBtnNode.addEventListener('click', () => {
  // Очищаем локальное хранилище
  clearPosts();

  // Очищаем список постов в ленте
  clearFeedList(feedListNode);

  // Показываем сообщение 'Тут пока что пусто...'
  showEmptyFeedMessage(emptyFeedMessageNode);
});

// Восстанавливаем посты при загрузке страницы
restorePosts();

// Функция для проверки строки на пустоту
function isEmpty(str) {
  return str.trim() === '';
}

// Функция для отображения предупреждения
function displayWarning(node, message) {
  node.style.display = 'block';
  node.textContent = message;
}

// Функция для скрытия предупреждения
function hideWarning(node) {
  node.style.display = 'none';
}

// Функция для создания элемента списка с постом
function createPostListItem(title, content, timestamp) {
  const listItem = createElement('li', 'post-list-item');
  const timestampElement = createElement('p', 'published-post-timestamp');
  const titleElement = createElement('h3', 'published-post-title');
  const contentElement = createElement('p', 'published-post-content');

  const formattedTimestamp = formatDate(timestamp);

  setTextContent(timestampElement, formattedTimestamp);
  setTextContent(titleElement, title);
  setTextContent(contentElement, content);

  appendChildren(listItem, [timestampElement, titleElement, contentElement]);

  return listItem;
}

// Функция для создания элемента с заданным тегом и классом
function createElement(tagName, className) {
  const element = document.createElement(tagName);
  element.classList.add(className);
  return element;
}

// Функция для установки текстового содержимого элемента
function setTextContent(element, text) {
  element.textContent = text;
}

// Функция для добавления дочерних элементов к родительскому элементу
function appendChildren(parent, children) {
  children.forEach((child) => parent.appendChild(child));
}

// Функция для добавления элемента в начало списка
function prependToFeedList(feedList, listItem) {
  feedList.prepend(listItem);
}

// Функция для сброса значений полей ввода
function resetInputFields(...inputNodes) {
  inputNodes.forEach((inputNode) => {
    inputNode.value = '';
  });
}

// Функция для очистки списка постов в ленте
function clearFeedList(node) {
  node.innerHTML = '';
}

// Функция для показа сообщения 'Тут пока что пусто...'
function showEmptyFeedMessage(node) {
  node.style.display = 'block';
}

// Функция для скрытия сообщения 'Тут пока что пусто...'
function hideEmptyFeedMessage(node) {
  node.style.display = 'none';
}

// Функция для сохранения поста в локальное хранилище
function savePost(title, content, timestamp) {
  let savedPosts = localStorage.getItem('posts');

  if (!savedPosts) {
    savedPosts = [];
  } else {
    savedPosts = JSON.parse(savedPosts);
  }

  savedPosts.push({ title, content, timestamp });

  localStorage.setItem('posts', JSON.stringify(savedPosts));
}

// Функция для восстановления постов из локального хранилища
function restorePosts() {
  const savedPosts = localStorage.getItem('posts');

  if (savedPosts) {
    const parsedPosts = JSON.parse(savedPosts);

    parsedPosts.forEach((post) => {
      const { title, content, timestamp } = post;
      const listItem = createPostListItem(title, content, new Date(timestamp));
      prependToFeedList(feedListNode, listItem);
    });
  }

  if (feedListNode.children.length > 0) {
    hideEmptyFeedMessage(emptyFeedMessageNode);
  } else {
    showEmptyFeedMessage(emptyFeedMessageNode);
  }
}

// Функция для очистки локального хранилища
function clearPosts() {
  localStorage.removeItem('posts');
}

// Функция для форматирования даты и времени
function formatDate(date) {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${day}.${month}.${year} ${hours}:${minutes}`;
}
