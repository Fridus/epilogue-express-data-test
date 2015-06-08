
var express = require('express'),
    Sequelize = require('sequelize'),
    epilogue = require('epilogue'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    Promise = Sequelize.Promise;

var app = express();

/*
  MIDDLEWARE
*/

app.use(cors({
  exposedHeaders: ['Content-Range']
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  console.log( '\n\nHeaders: ', req.headers, '\n\n',
      'Params: \n', req.query, '\n\n'
  );
  next();
});


/*
  DATABASE
*/

var sequelize = new Sequelize('main', null, null, {
  dialect: 'sqlite',
  storage: ':memory:',
  logging: true
});

var User = require('./models/user')(sequelize);
var Project = require('./models/project')(sequelize);
var Task = require('./models/task')(sequelize);
var Address = require('./models/address')(sequelize);

Project.hasMany(Task, {
  as: 'tasks',
  foreignKeyConstraint: true
});
Task.belongsTo(Project, {
  // foreignKey: {
  //    //allowNull: false, //BUG MYSQL
  //    //unique: true
  //  },
   constraints: true,
   as: 'project',
  foreignKeyConstraint: true
});

Project.belongsToMany(User, {through: 'user_project'});
User.belongsToMany(Project, {through: 'user_project'});

User.belongsTo(Address);


sequelize.sync({force: true}).then(function () {

  var add = [];
  for(var i = 1; i <= 5; i++) {
    add.push(User.create({
      firstName: 'Mr ' + i,
      lastName: 'A - ' + i
    }));

    add.push(Project.create({
      title: 'Project ' + i,
      description: 'description ' + i
    }));

    add.push(Task.create({
      title: 'Task ' + i,
      description: '... ' + i
    }));
  }

  add.push(Address.create({
    street: '221B Baker Street',
    state_province: 'London',
    postal_code: 'NW1',
    country_code: '44'
  }));

  add.push(Address.create({
    street: 'Rue Louis de Geer 6',
    state_province: 'LLN',
    postal_code: '1348',
    country_code: '32'
  }));

  return Promise.all(add).then(function(res) {
    /*
      Users: 0,3,6,9,12
      Projects: 1,4,7,10,13
      Tasks: 2,5,8,11,14
      Addresses: 15,16
    */
    return Promise.all(
      // User 1 -> Project 1 and 3
      res[0].setProjects([res[1], res[7]]),
      // User 2 -> Project 1 and 2
      res[3].setProjects([res[1], res[4]]),
      // User 3 -> Project 2
      res[6].setProjects([res[4]]),
      // Project 1 -> Task 1 and 3
      res[1].setTasks([res[2], res[8]]),
      // Project 2 -> Task 2 and 4
      res[4].setTasks([res[5], res[11]]),
      // User 1 -> Address 1
      res[0].setAddress(res[15])
    );
  });
});


/*
  API REST
*/

epilogue.initialize({
  app: app,
  sequelize: sequelize
});

var userResource = epilogue.resource({
  model: User,
  search: {
    attributes: ['firstName', 'lastName']
  },
  //,pagination: false
  associations: true
  //include: [Address]
});
epilogue.resource({
  model: Project,
  search: {
    attributes: ['title', 'description']
  },
  associations: true
  //include: [{ model: Task, as: 'tasks' }]
});
epilogue.resource({
  model: Task,
  search: {
    attributes: ['title', 'description']
  },
  associations: true
  //include: [{ model: Project, as: 'project' }]
});

epilogue.resource({
  model: Address
});

app.get('/', function(req, res) {
  function space(x) {
    var res = '';
    while(x--) res += ' ';
    return res;
  }
  var routes = [];
  app._router.stack.forEach(function(a){
    var route = a.route;
    if(route){
      route.stack.forEach(function(r){
        var method = r.method.toUpperCase();
        routes.push(method + space(8 - method.length) + route.path);
      });
    }
  });

  res.send(routes.join('\n'));
});

app.listen(9000);
