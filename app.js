// github.js
// ui.js
// app.js


// Github Class
class Github{
    // constructor
    constructor(){
        this.clientId = '2e36b40cd2cb9995ebd0',
        this.clientSecret = '73fa3ccc5fc15ce80ae947b9a3960e0fa90f32eb',
        this.repos_count = 5,
        this.repos_sort = 'created: asc'
    }

    // Making a get User Request to UserInput
    async getUser(userInput){//parameter
        // profileRespone
        const profileResponse = await fetch(`https://api.github.com/users/${userInput}?clientId=${this.clientId}?clientSecret=${this.clientSecret}`);

        //repoResponse 
        const repoResponse = await fetch(`https://api.github.com/users/${userInput}/repos?per_page=${this.repos_count}&sort=${this.repos_sort}&clientId=${this.clientId}&clientSecret=${this.clientSecret}`);

        const profile = await profileResponse.json();

        const repos = await repoResponse.json();

        return{
            profile,
            repos
        }
    }
}

// end github class



// ui

//ui class
class UI{
    constructor(){
        this.profile = document.getElementById('profile');
    }
    
    // Display Github User profile
    showProfile(user){//parameter
        this.profile.innerHTML = 
            `
                <div class="card card-body">
                    <div class="row">
                        <div class="col-md-3">
                            <img class="img-fluid mb-2" src="${user.avatar_url}">
                            <p>Name: ${user.name}</p>
                            <a href="${user.html_url}" class="btn btn-success btn-block" target="_blank">View Profile</a>
                        </div>
                        <div class="col-md-9 my-3">
                            <span class="badge badge-primary">Public Repos: ${user.public_repos}</span>
                            <span class="badge badge-dark">Public Gists: ${user.public_gists}</span>
                            <span class="badge badge-success">Followers: ${user.followers}</span>
                            <span class="badge badge-info">Following: ${user.following}</span>
                            <br><br>
                            <ul class="list-group">
                                <li class="list-group-item">Company: ${user.company}</li>
                                <li class="list-group-item">Website/Blog: ${user.blog}</li>
                                <li class="list-group-item">Location: ${user.location}</li>
                                <li class="list-group-item">Member Since: ${user.created_at}</li>
                            </ul>
                        </div>
                    </div>
                    <h3 class="page-heading mb-3">Latest Repos: </h3>
                    <div id="repos"></div>
                </div>
            `
    }


    // Display User Repos
    showRepos(repos){
        let output = '';
        repos.forEach(function(repo){
            output +=
                `
                    <div class="card card-body mb-2">
                        <div class="row">
                            <div class="col-md-6">
                                <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                            </div>
                            <div class="col-md-6">
                                <span class="badge badge-primary">Stars: ${repo.stargazers_count}</span>
                                <span class="badge badge-dark">Watchers: ${repo.watchers_count}</span>
                                <span class="badge badge-success">Forks: ${repo.forks_count}</span>
                                <span class="badge badge-info">Language: ${repo.language}</span>
                            </div>
                        </div>
                    </div>
                `
        })

        document.getElementById('repos').innerHTML = output;
    }


    // clear Alert
    clearAlert(){
        setTimeout(function(){
            // what u want to clear
            const currentAlert = document.querySelector('.alert');
            if(currentAlert){
                currentAlert.remove();
            }
        }, 1000);
    }

    // show Alert in UI when user is not found
    showAlert(message, className){
        // call clear Alert from UI
        this.clearAlert();

        // alert div
        const div = document.createElement('div');
        // add alert classes
        div.className = className;
        // append message to div message
        div.appendChild(document.createTextNode(message));

        // get parent
        const container = document.querySelector('.searchContainer');
        // get search div
        const search = document.querySelector('.search');
        // placed alert after parent but b4 search
        container.insertBefore(div, search);
    }

    // clear Profile
    clearProfile(){
        this.profile.innerHTML = '';
    }
} 


// end ui



// app

// Instantiate userInput i.e Github class
const github = new Github;

// instantiate UI class
const ui = new UI;

// Search User
const searchUser = document.getElementById('searchUser').addEventListener('keyup', function(e){
    const userInput = e.target.value;
    
    // if user input is not empty
    if(userInput !== ''){
        // Display User
        // Making a get User Request to UserInput
        github.getUser(userInput)
            .then(data => {
                // If UserInput profile is not found
                if(data.profile.message === 'Not Found'){
                    // Show Alert ui.js
                    ui.showAlert('User Not Found', 'alert alert-danger');
                }
                else{
                    // i.e data.profile.message is found
                    // Show Profile ui.js
                    // pass in the argument
                    ui.showProfile(data.profile);

                    // show user repos
                    ui.showRepos(data.repos);
                }
            })
    }
    // if user input is empty
    else{
        // clear profile ui.js 
        ui.clearProfile();
    }
})
// end app