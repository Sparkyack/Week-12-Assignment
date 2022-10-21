class Team{
    constructor(name){
        this.name=name;
        this.players=[];
    }

    addPlayer(name, position){
        this.players.push(new Player(name, position));
    }
}

class Player{
    constructor(name, position){
        this.name=name;
        this.position=position;
    }
}

class TeamService{
    static url = "https://635178c7dfe45bbd55c11e18.mockapi.io/api/Teams";

    static getAllTeams(){
        return $.get(this.url);
    }

    static getTeam(id){
        return $.get(this.url + `/${id}`);
    }

    static createTeam(team){
        console.log(team);
        return $.post(this.url, team);
    }

    static updateTeam(team){
         console.log("updatehouse:", team)
        return $.ajax({
            url: this.url + `/${team._id}`,
            dataType: "json",
            data: JSON.stringify(team),
            contentType: "application/json",
            type: "PUT"
        });
    }

    static deleteTeam(id){
        return $.ajax({
           url: this.url + `/${id}`,
           type: "Delete" 
        });
    }
}

class DOMManager{
    static teams;

    static getAllTeams(){
        TeamService.getAllTeams().then(teams => this.render(teams));
    }

    static createTeam(name){
        TeamService.createTeam(new Team(name))
        .then(() => {
            return TeamService.getAllTeams();
        })
        .then((teams) => this.render(teams));
    }

    static deleteTeam(id){
        // console.log("deleteteam:",id);
        TeamService.deleteTeam(id)
        .then(() => {
            return TeamService.getAllTeams();
        })
        .then((teams) => this.render(teams));
    }

    static addPlayer(id){
        // console.log("addplayer:", id);
        for(let team of this.teams){
            // console.log("addroom for of loop:", house)
            if(team._id == id) {
                // console.log(house._id);
                team.players.push(new Player($(`#${team._id}-player-name`).val(), $(`#${team._id}-player-position`).val()));
                // console.log(house.rooms);
                TeamService.updateTeam(team)
                .then(() =>{
                    return TeamService.getAllTeams();
                })
                .then((teams) => this.render(teams));
            }
        }
    }

    static deletePlayer(teamId, playerId){
        for(let team of this.teams){
            if(team._id == teamId){
                for(let player of team.players){
                    if(player._id == playerId){
                        team.players.splice(team.players.indexOf(player),1)
                        TeamService.updateteam(team)
                        .then(() =>{
                            return TeamService.getAllTeams();
                        })
                        .then((teams) => this.render(teams));
                    }
                }
            }
        }
    }

   

    static render(teams){
        // console.log(teams);
        this.teams=teams;
        // console.log(teams);
        $("#app").empty();
        for(let team of teams){
           $("#app").prepend(
                `<div id="${team._id}" class="card">
                    <div class="card-header">
                        <h2>${team._id}<h2>
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
            for(let player of team.players){
                $(`#${team._id}`).find(`.card-body`).append(
                    `<p>
                    <span id="name-${player._id}"><strong>Name: </strong> ${player.name}</span>
                    <span id="position-${player._id}"><strong>Position: </strong> ${player.position}</span>
                    <button class="btn btn-danger" onClick="DOMManager.deleteplayer('${team._id}' , '${player._id}')">Delete Player</button>`
                );
            }
        }    
    }
};



$('#create-new-team').click(() => {
    DOMManager.createTeam($("#new-team-name").val());
    $("#new-team-name").val("");
});

DOMManager.getAllTeams();