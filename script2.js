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

  // Reload the page when clicking on the logo
  const logoElement = document.getElementById("logo");
  logoElement.addEventListener("click", () => {
    location.reload();
  });

  // Helper function to determine the category icon URL based on category
  function getCategoryIconUrl(category) {
    if (category === "Movie") {
      return "url('assets/icon-category-movie.svg')";
    } else if (category === "TV Series") {
      return "url('assets/icon-category-tv.svg')";
    }
    // Return a default icon URL if category is unknown
    return "url('assets/icon-category-movie.svg')";
  }

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

          movieCard.addEventListener("click", () => {
            // Toggle the isBookmarked value
            movie.isBookmarked = !movie.isBookmarked;

            // Update the local storage data
            updateLocalStorage();

            // Recreate the movie cards to reflect the changes only if the category is not "Bookmark"
            if (currentCategory !== "Bookmarked Shows") {
              createMovieCards(filteredMovies);
            }
          });

          // Determine the bookmark icon class based on isBookmarked value
          const bookmarkIconClass = movie.isBookmarked
            ? "bookmark-icon active"
            : "bookmark-icon";

          // Create the content for each movie card
          movieCard.innerHTML = `
              <div class="movie-img-container">
                <div class="button-overlay">
                  <button class="play-button">
                    <img src="assets/icon-play.svg" alt="Play" class="play-icon">
                    <h1 class="play">Play</h1>
                  </button>
                </div>
                <button class="${bookmarkIconClass}"></button>
              </div>
              <div class="movie-details">
                <div class="movie-info">
                  <span id="year">${movie.year}</span>
                  <span class="bullet">&bull;</span>
                  <span class="category-icon" style="background-image: ${getCategoryIconUrl(
                    movie.category
                  )};"></span>
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

          trendingCard.addEventListener("click", () => {
            // Toggle the isBookmarked value
            movie.isBookmarked = !movie.isBookmarked;

            // Update the local storage data
            updateLocalStorage();

            // Recreate the trending cards to reflect the changes
            createTrendingCards(trendingMovies);
          });

          // Determine the bookmark icon class based on isBookmarked value
          const bookmarkIconClass = movie.isBookmarked
            ? "bookmark-icon active"
            : "bookmark-icon";

          // Create the content for each trending card
          trendingCard.innerHTML = `
            <div class="movie-img-container">
            <div class="button-overlay">
                <button class="play-button">
                <img src="assets/icon-play.svg" alt="Play" class="play-icon">
                <h1 class="play">Play</h1>
                </button>
            </div>
            <button class="${bookmarkIconClass}"></button>
            </div>
            <div class="movie-details">
            <div class="movie-info">
                <span id="year">${movie.year}</span>
                <span class="bullet">&bull;</span>
                <span class="category-icon" style="background-image: ${getCategoryIconUrl(
                  movie.category
                )};"></span>
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
            const filteredMovies = moviesData.filter((movie) =>
              movie.title.toLowerCase().includes(searchQuery)
            );
            currentCategory = `Found ${filteredMovies.length} results for '${searchQuery}'`;
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
            createBookmarkedCards();
          }
        }
      }
      categoryHeading.textContent = currentCategory; // Update category heading
    });

    // Function to filter movies by category and search query
    const filterMoviesByCategoryAndSearch = (category, searchQuery) => {
      const filteredMovies = moviesData.filter(
        (movie) =>
          movie.category === category &&
          movie.title.toLowerCase().includes(searchQuery)
      );
      createMovieCards(filteredMovies);
      currentCategory = `Found ${filteredMovies.length} results for '${searchQuery}'`;
    };

    // Function to filter bookmarked movies by search query
    const filterBookmarkedMoviesBySearch = (searchQuery) => {
      const bookmarkedMovies = moviesData.filter(
        (movie) =>
          movie.isBookmarked === true &&
          movie.title.toLowerCase().includes(searchQuery)
      );

      if (bookmarkedMovies.length > 0) {
        createMovieCards(bookmarkedMovies);
        currentCategory = `Found ${bookmarkedMovies.length} bookmarked results for '${searchQuery}'`;
      } else {
        moviesContainer.innerHTML = ""; // Clear existing content
        currentCategory = "No bookmarked shows found";
      }
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

    // Create and populate movie cards for the default "Home" category
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

      if (bookmarkedContent.length > 0) {
        const bookmarkedHeading = document.createElement("h2");
        bookmarkedHeading.textContent = "Bookmarked Content";
        bookmarkedHeading.classList.add("category-heading");
        moviesContainer.innerHTML = ""; // Clear existing content
        moviesContainer.appendChild(bookmarkedHeading);
        createMovieCards(bookmarkedContent);
        currentCategory = "Bookmarked Shows";

      } else {
        currentCategory = "No Bookmarked Shows";
        console.log(currentCategory);
        moviesContainer.innerHTML = ""; // Clear existing content
        categoryHeading.textContent = currentCategory; // Update category heading
      }

      document.querySelectorAll(".movie-card").forEach((movieCard) => {
        movieCard.addEventListener("click", () => {
          const isBookmarkTab = document
            .querySelector("#bookmark")
            .classList.contains("active");
          if (isBookmarkTab) {
            movieCard.style.display = "none";
          }
        });
      });
      
    }
  
    
    // Helper function to update local storage
    function updateLocalStorage() {
      localStorage.setItem("moviesData", JSON.stringify(moviesData));
    }
  }
});

window.addEventListener("scroll", () => {
   if (window.innerWidth <= 768) {
     // Apply behavior only for screens below 769 pixels
     const currentScrollPos = window.scrollY;

     if (currentScrollPos > prevScrollPos) {
       // Scrolling down
       if (isScrollingUp) {
         sidebar.style.transform = "translateY(-150%)";
         isScrollingUp = false;
       }
     } else {
       // Scrolling up
       if (!isScrollingUp) {
         sidebar.style.transform = "translateY(0)";
         isScrollingUp = true;
       }
     }

     prevScrollPos = currentScrollPos;
   }
});
const sidebar = document.querySelector(".sidebar");
let prevScrollPos = window.scrollY;
let isScrollingUp = true;

