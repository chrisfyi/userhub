const BASE_URL = 'https://jsonplace-univclone.herokuapp.com';

function fetchData(url){
  return fetch(url)
  .then(result =>{
    return result.json();
  })
  .catch( err =>{
    // console.error('Error getting data!' , err)
  })
}
fetchData()

function fetchUsers() {
    return fetchData(`${ BASE_URL }/users`)
    //   .then(result => {
    //   return result.json();
    // })
    //   .catch(function (err) {
    //   console.error('Error!' , err);
    //   })
  }


function renderUser(user) {
    return $(`
    <div class = "user-card">
        <header>
            <h2>${user.name}</h2>
        </header>
      <section class= "company-info">
        <p><b>Contact:</b> ${user.email , user.phone}</p>
        <p><b>Works for:</b> ${user.company.name}</p>
        <p><b>${user.company.catchPhrase}:</b> </p>
      </section>
      <footer>
    <button class="load-posts">${user.username} Posts</button>
    <button class="load-albums">${user.username} Albums</button>
  </footer>
</div>`).data('user', user);
};


function renderUserList(userList) {
  $('#user-list').empty();
 console.log(userList)
  userList.forEach(user => {
    $('#user-list').append(renderUser(user))
  })
};

$('#user-list').on('click', '.user-card .load-posts', function () {
  // load posts for this user
  const user = $(this).closest('.user-card').data('user')
  // render posts for this user
  fetchUserPosts(user.id)
  .then(renderPostList);
});

$('#user-list').on('click', '.user-card .load-albums', function () {
  // load albums for this user
  const user = $(this).closest('.user-card').data('user')
  // render albums for this user
  fetchUserAlbumList(user.id)
  .then(renderAlbumList);
});


/* get an album list, or an array of albums */
function fetchUserAlbumList(userId) {
  return fetchData(`${ BASE_URL }/users/${userId}/albums?_expand=user&_embed=photos`)
  // .then(response => {
  //   return response.json();
  // })
  // .catch(error => {
  //   // console.error out the error
  //   console.error(error)
  // });
}

fetchUserAlbumList(1).then(albumList => {
  console.log(albumList);
});

/* render a single photo */


/* render a single album */
function renderAlbum(album) {
  const albumCard = $(`<div class="album-card">
    <header>
      <h3> ${album.title}, by ${album.user.username} </h3>
    </header>
    <section class="photo-list">
    </section>
          </div>`);
           
        const photoElement = albumCard.find('.photo-list')
          album.photos.forEach(photo => {
            photoElement.append( renderPhoto(photo) );
          })

          return albumCard
}

function renderPhoto(photo) {
  return $(`<div class="photo-card">
  <a href="${photo.url}" target="_blank">
    <img src="${photo.thumbnailUrl}">
    <figure>${photo.title}</figure>
  </a>
  </div>`)
  
}


/* render an array of albums */
function renderAlbumList(albumList) {
  $('#app section.active').removeClass('active');

  const albumElement = $('#album-list');
  albumElement.empty().addClass('active');
  
   albumList.forEach(album => {
     albumElement.append(renderAlbum(album))
   })
  }
  

  fetchUserAlbumList(1).then(renderAlbumList);


  function fetchUserPosts(userId) {
    return fetchData(`${ BASE_URL }/users/${ userId }/posts?_expand=user`);
  }
  
  function fetchPostComments(postId) {
    return fetchData(`${ BASE_URL }/posts/${ postId }/comments`);
  }

  fetchUserPosts(1).then(console.log); // why does this work?  Wait, what?  

  fetchPostComments(1).then(console.log); // again, I'm freaking out here! What gives!?


  function setCommentsOnPost(post) {
    // if we already have comments, don't fetch them again
    if (post.comments) {
      return Promise.reject(null)
      // #1: Something goes here
    }
  
    // fetch, upgrade the post object, then return it
    return fetchPostComments(post.id)
              .then(comments => {
      // #2: Something goes here
          post.comments = comments;
          return post;
    });
  }

  function renderPost(post) {
    return  $(`<div class="post-card">
      <header>
        <h3>${post.title}</h3>
        <h3>${post.user.username} </h3>
      </header>
      <p>${post.body}</p>
      <footer>
        <div class="comment-list"></div>
        <a href="#" class="toggle-comments">(<span class="verb">show</span> comments)</a>
      </footer>
    </div>`)
  }
  
function renderPostList(postList) {
    $('#app section.active').removeClass('active');

    const postElement = $('#album-list');
    postElement.empty().addClass('active');
    
     postList.forEach(post => {
       postElement.append(renderPost(post))
     })
    }

function toggleComments(postCardElement) {
      const footerElement = postCardElement.find('footer');
    
      if (footerElement.hasClass('comments-open')) {
        footerElement.removeClass('comments-open');
        footerElement.find('.verb').text('show');
      } else {
        footerElement.addClass('comments-open');
        footerElement.find('.verb').text('hide');
      }
    }  

    $('#post-list').on('click', '.post-card .toggle-comments', function () {
      const postCardElement = $(this).closest('.post-card');
      const post = postCardElement.data('post');
    
      setCommentsOnPost(post)
        .then(function (post) {
          console.log('building comments for the first time...', post);
        })
        .catch(function () {
          console.log('comments previously existed, only toggling...', post);
        });
    });
function bootstrap() {
    fetchUsers()
    .then(renderUserList);  
    
   
  };
  
  bootstrap();