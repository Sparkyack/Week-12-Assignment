class Team {                                             //team class that hold all the team name and players array
    constructor(name) {                                  //team name
      this.name = name;
      this.players = [];                                 //teasm array of players
    }
  
    addPlayer(name, position) {                          //add player method takes name and position as perimeters
      this.players.push(new Player(name, position));     //takes players array and pushes name and position to make a new Player
    }
  }
  
  class Player {                                          //player class to hold name and position perameters
    constructor(name, position,) {                        
      this.name = name;                                    //varable made for player name
      this.position = position;                            //varable made for player position
    }
  }
  
  class TeamService {                                                       //teamservice class was made to handle all api functions to return
    static url = "https://635178c7dfe45bbd55c11e18.mockapi.io/api/Teams";   //url address for api
  
    static getAllTeams() {                                                   //get all teams method returns all stored teams in the api server and displays them as a website
      return $.get(this.url);
    }
  
    static getTeam(id) {                                                      //gets a specific team from the server and displays it
      return $.get(this.url + `/${id}`);
    }
  
    static createTeam(team) {                                                 //create team method takes input as a string and adds it to the teams array in the api
      console.log(team);
      return $.post(this.url, team);                                           //returns and displays the team on the webpage
    }
  
    static updateTeam(team) {                                                  //this method is the update team function. Whatever input is entered this is going to take that info in
      console.log("updateteam:", team);                                        //and displays the updated info onto the server
      return $.ajax({
        url: this.url + `/${team._id}`,
        dataType: "json",
        data: JSON.stringify(team),
        contentType: "application/json",
        type: "PUT",
      });
    }
  
    static deleteTeam(id) {                                                     //this is the method for deleting a team by id
      return $.ajax({                                                           //uses ajax to take the data and return the results of deleting
        url: this.url + `/${id}`,
        type: "Delete",
      });
    }
  }
  
  class DOMManager {                                                              //class made to handle all the static methods of the app
    static teams;                                                                 //calls all teams and displays them
  
    static getAllTeams() {                                                        //get all teams method useed with the get all teams method to delete a team
      TeamService.getAllTeams().then((teams) => {                                 //call teamservice/getAllTeams then renders them
        console.log("This is the teams returned from the getAllTeams API request:",teams);
        this.render(teams);                                              // calls the render method and passes the teams array returned from the API request
      });
    }
  
    static createTeam(name) {                                             //create team method used with the create team method and returns the  new team
      TeamService.createTeam(new Team(name))                              //calls create team method and takes the name and crerates new Team
        .then(() => {
          return TeamService.getAllTeams();                               //returns all new teams
        })
        .then((teams) => this.render(teams));                             //then renders them to web page
    }
  
    static deleteTeam(id) {                                                //delete team method takes an Id
      console.log("deleteteam:",id);
      TeamService.deleteTeam(id)                                           //takes team id then deletes it per id
        .then(() => {
          return TeamService.getAllTeams();
        })
        .then((teams) => this.render(teams));                              //renders remaining teams
    }
  
    static addPlayer(id) {                                                 //add player takes an id
      console.log("addplayer:", id);
      for (let team of this.teams) {                                       //loops through each team
        if (team._id == id) {                                              //if id's match,
          team.players.push(                                               //then push a new player to make an new instance of new Player
            new Player(
              $(`#${team._id}-player-name`).val(),                         //player name value taken in from the input field
              $(`#${team._id}-player-position`).val()                      //position value taken from the input field
            )
          );
          TeamService.updateTeam(team)                                     //runs updateTeam method and grabs all updated data
            .then(() => {
              return TeamService.getAllTeams();                            //returns all data from server
            })
            .then((teams) => this.render(teams));                          //and renders to webpage
        }
      }
    }
  
    static deletePlayer(teamId, playerId) {                                //delete player method takes team and player id
      for (let team of this.teams) {                                       //loops through all teams of the teams array
        if (team._id == teamId) {                                          //if conditional statement
          for (let player of team.players) {                               //loops through each player of the players array of each team
            if (player.name == playerId) {                                 //if the players name equals player Id
              team.players.splice(team.players.indexOf(player.name), 1);   //splice out the player selected by index
              TeamService.updateTeam(team)                                 //runs updateTeam method and grabs all updated data
                .then(() => {
                  return TeamService.getAllTeams();                        //returns all updated data
                })
                .then((teams) => this.render(teams));                      //and renders to webpage
            }
          }
        }
      }
    }
  
    static render(teams) {                                          //this is the render function that will render all the stored teams
      // console.log(teams);
      this.teams = teams;                                           //team varable made from the team class
      // console.log(teams);
      $("#app").empty();                                            //calls the app div made in the html file. Thats where all the rendering will be placed
      for (let team of teams) {                                     //loops through all the stored teams and displays them in their seperate divs
        $("#app").prepend(                                          //the following is all the added html it takes to add new team divs and input field for new player and position
          `<div id="${team._id}" class="card">                      
                      <div class="card-header">
                      <!-- Need to reference the team.name in your heading 2 tag. -->
                          <h2>${team.name}<h2> 
                          <button class="btn btn-danger" onClick="DOMManager.deleteTeam('${team._id}')">Delete Team</button>
                      </div>
                      <div class="card-body">
                          <div class="card">
                              <div class="row">
                                  <div class="col-sm">
                                      <input type="text" id="${team._id}-player-name" class="form-control" Placeholder="Player Name">
                                  </div>
                                  <div class="col-sm">
                                      <input type="text" id="${team._id}-player-position" class="form-control" Placeholder="Player Position">
                                  </div>
                              </div>
                              <button id="${team._id}-new-player" onClick="DOMManager.addPlayer('${team._id}')" class="btn btn-primary form-control">Add Player</button>
                          </div>
                      </div>
                  </div><br>`
        );
        for (let player of team.players) {                            //this is rendered when a new player is added to the team
          $(`#${team._id}`)                                           //it adds a card with player name position and delete player button
            .find(`.card-body`)
            .append(
            `<p>
                <span id="name-${player._id}"><strong>Name: </strong> ${player.name}</span>
                <span id="position-${player._id}"><strong>Position: </strong> ${player.position}</span>
                <button class="btn btn-danger" onClick="DOMManager.deletePlayer('${team._id}' , '${player.name}')">Delete Player</button>`
            );
        }
      }
    }
  }
  
  $("#create-new-team").click(() => {                 //function created to handle the click event listener to create a new team
    DOMManager.createTeam($("#new-team-name").val()); //calls the dommanager and the createteam function in the manager
    $("#new-team-name").val("");                      //resets the input field back to an empty string
  });
  
  DOMManager.getAllTeams();                            //calls the getAllteams function 