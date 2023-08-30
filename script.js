document.addEventListener("DOMContentLoaded", () => {
  const moviesContainer = document.querySelector(".movies");
  const navItems = document.querySelectorAll(".nav-icons");
  const categoryHeading = document.getElementById("category-heading");
  const searchBar = document.querySelector(".search-bar");
  const trendingCarouselContainer = document.querySelector(
    ".trending-carousel-container"
  );
  const trendingCardsContainer = document.querySelector(".trending-cards");

  let currentCategory = "Recommended for you";
  let currentPlaceholder = "Search for movies or TV Series";

  // Helper function to remove active class from all nav icons
  function deactivateNavIcons() {
    navItems.forEach((navItem) => {
      navItem.classList.remove("active");
    });
  }

  // Retrieve JSON data from local storage or fetch and store if not present
  let moviesData = JSON.parse(localStorage.getItem("moviesData"));

  if (!moviesData) {
    fetch("data.json")
      .then((response) => response.json())
      .then((fetchedMoviesData) => {
        moviesData = fetchedMoviesData;
        localStorage.setItem("moviesData", JSON.stringify(moviesData));
        initApp();
      })
      .catch((error) => console.error("Error fetching data:", error));
  } else {
    initApp();
  }

  // Initialize the application once data is available
  function initApp() {
    // Create and populate movie cards function
    const createMovieCards = (filteredMovies) => {
      // Clear existing movie cards
      moviesContainer.innerHTML = "";

      if (filteredMovies.length > 0) {
        // Loop through the filtered movies and create movie cards
        filteredMovies.forEach((movie) => {
          const movieCard = document.createElement("div");
          movieCard.classList.add("movie-card");

          // Create the content for each movie card
          movieCard.innerHTML = `
              <div class="movie-img-container">
                <div class="button-overlay">
                  <button class="play-button">
                    <img src="assets/icon-play.svg" alt="Play" class="play-icon">
                    <h1 class="play">Play</h1>
                  </button>
                </div>
                <button class="bookmark-icon"></button>
              </div>
              <div class="movie-details">
                <div class="movie-info">
                  <span id="year">${movie.year}</span>
                  <span class="bullet">&bull;</span>
                  <span id="category-icon" class="category-icon"></span>
                  <span id="category">${movie.category}</span>
                  <span class="bullet">&bull;</span>
                  <span id="rating">${movie.rating}</span>
                </div>
                <div class="movie-title-container">
                  <h1 id="title">${movie.title}</h1>
                </div>
              </div>
            `;

          // Apply initial background image using CSS style
          const initialBackground = `url('${movie.thumbnail.regular.large}')`;
          const movieImgContainer = movieCard.querySelector(
            ".movie-img-container"
          );
          movieImgContainer.style.backgroundImage = initialBackground;

          // Add hover effect using JavaScript
          movieImgContainer.addEventListener("mouseenter", () => {
            movieImgContainer.style.background = `
                linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
                ${initialBackground} center/cover no-repeat`;
          });

          movieImgContainer.addEventListener("mouseleave", () => {
            movieImgContainer.style.background = `
                linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)),
                ${initialBackground} center/cover no-repeat`;
          });

          // Append the movie card to the movies container
          moviesContainer.appendChild(movieCard);
        });
        categoryHeading.textContent = currentCategory;
      } else {
        categoryHeading.textContent = "Shows not found";
      }
    };

    // Create and populate trending cards with horizontal scroll
    const createTrendingCards = (trendingMovies) => {
      trendingCardsContainer.innerHTML = "";

      if (trendingMovies.length > 0) {
        const trendingCardsWrapper = document.createElement("div");
        trendingCardsWrapper.classList.add("trending-cards-wrapper"); // Add a CSS class

        trendingMovies.forEach((movie) => {
          const trendingCard = document.createElement("div");
          trendingCard.classList.add("trending-card");

          // Create the content for each trending card
          trendingCard.innerHTML = `
            <div class="movie-img-container">
            <div class="button-overlay">
                <button class="play-button">
                <img src="assets/icon-play.svg" alt="Play" class="play-icon">
                <h1 class="play">Play</h1>
                </button>
            </div>
            <button class="bookmark-icon"></button>
            </div>
            <div class="movie-details">
            <div class="movie-info">
                <span id="year">${movie.year}</span>
                <span class="bullet">&bull;</span>
                <span id="category-icon" class="category-icon"></span>
                <span id="category">${movie.category}</span>
                <span class="bullet">&bull;</span>
                <span id="rating">${movie.rating}</span>
            </div>
            <div class="movie-title-container">
                <h1 id="title">${movie.title}</h1>
            </div>
            </div>
        `;

          trendingCardsWrapper.appendChild(trendingCard);

          // Apply initial background image using CSS style
          const initialBackground = `url('${movie.thumbnail.trending.large}')`;
          const trendingImgContainer = trendingCard.querySelector(
            ".movie-img-container"
          );
          trendingImgContainer.style.backgroundImage = initialBackground;

          // Add hover effect using JavaScript
          trendingImgContainer.addEventListener("mouseenter", () => {
            trendingImgContainer.style.background = `
          linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
          ${initialBackground} center/cover no-repeat`;
          });

          trendingImgContainer.addEventListener("mouseleave", () => {
            trendingImgContainer.style.background = `
          linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)),
          ${initialBackground} center/cover no-repeat`;
          });
        });

        trendingCardsContainer.appendChild(trendingCardsWrapper);

        trendingCarouselContainer.style.display = "block";
      } else {
        trendingCarouselContainer.style.display = "none";
      }
    };

    // Add input event listener to search bar
    searchBar.addEventListener("input", () => {
      const searchQuery = searchBar.value.toLowerCase();
      const activeNavIcon = document.querySelector(".nav-icons.active");
      // Hide the trending carousel container while searching
      trendingCarouselContainer.style.display = "none";

      if (searchQuery) {
        if (activeNavIcon) {
          const categoryId = activeNavIcon.id;

          if (categoryId === "movies") {
            filterMoviesByCategoryAndSearch("Movie", searchQuery);
          } else if (categoryId === "tv-series") {
            filterMoviesByCategoryAndSearch("TV Series", searchQuery);
          } else if (categoryId === "home") {
            // Filter across all movies regardless of category
            currentCategory = "All Shows"; // Update the category label immediately
            const filteredMovies = moviesData.filter((movie) =>
              movie.title.toLowerCase().includes(searchQuery)
            );
            createMovieCards(filteredMovies);
          } else if (categoryId === "bookmark") {
            filterBookmarkedMoviesBySearch(searchQuery);
          }
        }
      } else {
        if (activeNavIcon) {
          const categoryId = activeNavIcon.id;

          if (categoryId === "movies") {
            filterMoviesByCategory("Movie");
          } else if (categoryId === "tv-series") {
            filterMoviesByCategory("TV Series");
          } else if (categoryId === "home") {
            createHomeCategoryCards(); // Display all movies in the "Home" category
          } else if (categoryId === "bookmark") {
            filterBookmarkedMovies();
          }
        }
      }
    });

    // Function to filter movies by category and search query
    const filterMoviesByCategoryAndSearch = (category, searchQuery) => {
      const filteredMovies = moviesData.filter(
        (movie) =>
          movie.category === category &&
          movie.title.toLowerCase().includes(searchQuery)
      );
      createMovieCards(filteredMovies);
      currentCategory = category;
    };

    // Function to filter bookmarked movies by search query
    const filterBookmarkedMoviesBySearch = (searchQuery) => {
      const bookmarkedMovies = moviesData.filter(
        (movie) =>
          movie.isBookmarked === true &&
          movie.title.toLowerCase().includes(searchQuery)
      );
      createMovieCards(bookmarkedMovies);
      currentCategory = "Bookmarked";
    };

    // Function to filter movies by category
    const filterMoviesByCategory = (category) => {
      const filteredMovies = moviesData.filter(
        (movie) => movie.category === category
      );
      createMovieCards(filteredMovies);
      currentCategory = category;
    };

    // Function to filter bookmarked movies
    const filterBookmarkedMovies = () => {
      const bookmarkedMovies = moviesData.filter(
        (movie) =>
          movie.isBookmarked === true &&
          (currentCategory === "Movies"
            ? movie.category === "Movie"
            : movie.category === "TV Series")
      );
      createMovieCards(bookmarkedMovies);
      currentCategory = "Bookmarked";
    };

    // Create movie cards for the "Home" category
    const createHomeCategoryCards = () => {
      const trendingMovies = moviesData.filter((movie) => movie.isTrending);
      createTrendingCards(trendingMovies);
      createMovieCards(
        moviesData.filter((movie) => movie.isTrending === false)
      );
      currentCategory = "Recommended for you";
      currentPlaceholder = "Search for movies or TV Series";
      categoryHeading.textContent = currentCategory;
      searchBar.placeholder = currentPlaceholder;
    };

    // Activate "Home" button by default
    const homeButton = document.getElementById("home");
    homeButton.classList.add("active");
    createHomeCategoryCards();

    // Handle "Home" button click
    homeButton.addEventListener("click", () => {
      deactivateNavIcons();
      homeButton.classList.add("active");
      createHomeCategoryCards();
    });

    // ...

    navItems.forEach((navItem) => {
      navItem.addEventListener("click", (event) => {
        event.preventDefault();

        deactivateNavIcons();
        navItem.classList.add("active");
        searchBar.value = "";

        const categoryId = navItem.id;

        if (categoryId === "movies") {
          trendingCarouselContainer.style.display = "none";
          createMovieCards(
            moviesData.filter((movie) => movie.category === "Movie")
          );
          currentCategory = "Movies";
          currentPlaceholder = "Search for movies";
        } else if (categoryId === "tv-series") {
          trendingCarouselContainer.style.display = "none";
          createMovieCards(
            moviesData.filter((movie) => movie.category === "TV Series")
          );
          currentCategory = "TV Series";
          currentPlaceholder = "Search for TV Series";
        } else if (categoryId === "home") {
          createHomeCategoryCards();
        } else if (categoryId === "bookmark") {
          trendingCarouselContainer.style.display = "none";
          createBookmarkedCards();
          currentCategory = "Bookmarked";
        }
        searchBar.placeholder = currentPlaceholder;
        categoryHeading.textContent = currentCategory;
      });
    });

   function createBookmarkedCards() {

     const bookmarkedMovies = moviesData.filter(
       (movie) => movie.isBookmarked === true && movie.category === "Movie"
     );

     const bookmarkedTVSeries = moviesData.filter(
       (movie) => movie.isBookmarked === true && movie.category === "TV Series"
     );

     const bookmarkedContent = [...bookmarkedMovies, ...bookmarkedTVSeries];

     moviesContainer.innerHTML = ""; // Clear existing content

     if (bookmarkedContent.length > 0) {
       const bookmarkedHeading = document.createElement("h2");
       bookmarkedHeading.textContent = "Bookmarked Content";
       bookmarkedHeading.classList.add("category-heading");
       moviesContainer.appendChild(bookmarkedHeading);
       createMovieCards(bookmarkedContent);
     } else {
       moviesContainer.innerHTML = ""; // Clear movies container
       categoryHeading.textContent = "No Bookmarked shows"; // Update category heading
     }
   }


  }
  // Helper function to update local storage
  function updateLocalStorage() {
    localStorage.setItem("moviesData", JSON.stringify(moviesData));
  }
});
