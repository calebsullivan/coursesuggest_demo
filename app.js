function filterForAll(cs, callback){

	db.query(QUERY_FILTER_ALL, 
		{code: cs}, function(err, result) {
	  	if (err) console.log(err);
	  	if(result) {	  		
			callback(result);
	  	}
		else {
	  		callback([]);
	  		return;
		}
	});
}

function filterCoursesInArray(cs, callback){
	db.query(QUERY_FILTER_COURES_IN_ARRAY, 
		{code: cs}, function(err, result) {
	  	if (err) console.log(err);
	  	if(result) {	  		
			callback(result);
	  	}
		else {
	  		callback([]);
	  		return;
		}
	});
}


function getAllRelRels(cs, callback){
	db.query(QUERY_REL_RELATIONSHIPS,
		{code: cs}, function(err, result) {
	  	if (err) console.log(err);
	  	if(result) {	  		
			callback(result);
	  	}
		else {
	  		callback([]);
	  		return;
		}
	});
}

function getAllRels(callback){
	db.query(QUERY_ALL_RELATIONSHIPS,
		{code: []}, function(err, result) {
	  	if (err) console.log(err);
	  	if(result) {	  		
			callback(result);
	  	}
		else {
	  		callback([]);
	  		return;
		}
	});
}

function rackCourse(c, callback){
	getPreTree([c], [], callback);
}

function getPreTree(course, processed, callback){
	var current = course.pop();
	processed.push(current);
	getPre(current, function(o){
		if(o[0] == undefined){
			callback(processed);
		}else{
			getPreTree(course.concat(o), processed, callback);
		}
		return;
	});
}

function getPre(p, callback){
    var query = GET_PREREQ_RELATION_QUERY;
	var output = [];

	db.query(query, {code: p}, function(err, result) {
	  	if (err) console.log(err);
	  	if(result) {	  		
			result.forEach(function(i){
				output.push(i.code);
			});
			callback(output);
			return;
	  	}
		else {
	  		callback([]);
	  		return;
		}
	});
}

function findPred(p){
	return 
}

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}


var BCSG = ["03-60-100", "03-60-140", "03-60-141", "03-60-212", "03-60-254", "03-60-256", "03-60-265", "03-60-266", "03-60-322", "03-60-315", "03-60-330", "03-60-334", "03-60-367", "03-60-280", "03-62-120", "03-62-140", "03-65-205"];

var BCSH = ["03-60-100", "03-60-140", "03-60-141", "03-60-212", "03-60-214", "03-60-231", "03-60-254", "03-60-256", "03-60-265", "03-60-266", "03-60-311", "03-60-315", "03-60-322", "03-60-330", "03-60-354", "03-60-367", "03-60-440", "03-60-454", 
"03-60-496", "03-62-140", "03-62-141", "03-62-190", "03-62-369", "03-65-205"];

//constants
const NEO4J_HOST = 'localhost';
const NEO4J_PORT = 7474;
const NEO4J_USER = 'neo4j';
const NEO4J_PASS = 'neo';

const GET_PREREQ_RELATION_QUERY =
	   "MATCH (p1:Course)<--(p2:Course) \
		WHERE p2.code =~ {code} \
		WITH DISTINCT p2 \
		MATCH (p1)<--(p2:Course) \
		RETURN DISTINCT p1"

const QUERY_FILTER_ALL =
	   "MATCH (n) \
		RETURN {label: n.name, \
				reqs: n.reqs, \
				code: n.code, \
				load: n.load, \
				id: n.id, \
				size: 100, \
				x: 0, \
				y: 0}"

const QUERY_FILTER_COURES_IN_ARRAY =
	   "MATCH (n) \
		WHERE n.code IN {code} \
		RETURN {label: n.name, \
				reqs: n.reqs, \
				code: n.code, \
				load: n.load, \
				id: n.id, \
				size: 100, \
				x: 0, \
				y: 0}"

const QUERY_REL_RELATIONSHIPS =
	   "MATCH n-[r]->m \
		WHERE n.code IN {code} AND m.code IN {code}\
	    RETURN {id: toString(id(r)), source: toString(n.id), target: toString(m.id)}"

const QUERY_ALL_RELATIONSHIPS =
	   "MATCH n-[r]->m \
	    RETURN {id: toString(id(r)), source: toString(n.id), target: toString(m.id)}"


var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , bodyParser = require('body-parser')
  , favicon = require('serve-favicon')
  , logger = require('morgan')
  , reload = require('reload')
  , methodOverride = require('method-override')
  , neo4j = require('neo4j');
var redis = require('redis');

var app = express();

app.set('port', process.env.PORT || 60000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(favicon(__dirname + '/public/images/favicon.png'));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

if (app.get('env') == 'development') {
	app.locals.pretty = true;
}

if (app.get('env') == 'development') {
	var db = require('seraph')({
	  server: 'http://' + NEO4J_HOST + ':' + NEO4J_PORT,
	  user: NEO4J_USER,
	  pass: NEO4J_PASS,
	  id: 'seraph'
	});
} else {
	url = require('url').parse(process.env.GRAPHENEDB_URL)

	var db = require("seraph")({
	  server: url.protocol + '//' + url.host,
	  user: url.auth.split(':')[0],
	  pass: url.auth.split(':')[1],
	  id: 'seraph'
	});	

	var redisURL = url.parse(process.env.REDISCLOUD_URL);
	var client = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
	client.auth(redisURL.auth.split(":")[1]);
}


app.get('/', routes.index);

var router = express.Router();  

router.get('/api/test', function(req, res) {
    res.json({ status: ['ok', 'ok', 'nan', 'ok'] });   
});

router.get('/api/programs', function(req, res)
	{res.sendfile('views/index-bulk.html', {root: __dirname })
});

router.get('/api/full', function(req, res) {
	filterForAll(BCSH, function(f){
		getAllRels(function(g){
			res.json({edges:g, nodes:f});
		});
	});
});

router.get('/api/BCSG', function(req, res) {
	filterCoursesInArray(BCSG, function(f){
		getAllRelRels(BCSG, function(g){
			res.json({edges:g, nodes:f});
		});
	});
});

router.get('/api/BCSH', function(req, res) {
	var processed = 0, t = [];
	BCSH.forEach(function(i){
		rackCourse(i, function(output){
			if(output == undefined){} else {
				output.forEach(function(j){
					processed++;
					if(processed === BCSH.length){
						filterCoursesInArray(t, function(f){
							getAllRelRels(t, function(g){
								res.json({edges:g, nodes:f});
								console.log(t);
							});
						});
					}
					t.push(j);
				});
			}
		});

	});
});	

router.get('/demo', function(req, res){
    res.render('demo', { title: 'Decision Making demo' });
	if (!(app.get('env') == 'development')){ 
		client.set(process.hrtime(), JSON.stringify(req))
		console.log(process.hrtime(), JSON.stringify(req));
	}
});

router.get('/programs/science/computer/BCSH', function(req, res){
    res.render('programs/science/computer/BCSH');
});

router.get('/programs/science/computer/BCSH/specalization/AI', function(req, res){
    res.render('programs/science/computer/BCSHAI');
});

router.get('/programs/science/computer/BCS/general', function(req, res){
    res.render('programs/science/computer/BCSG');
});

router.get('/programs/science/undeclared', function(req, res){
    res.render('programs/science/undeclared');
});

router.get('/programs/engineering/electrical', function(req, res){
    res.render('programs/engineering/electrical');
});

router.get('/programs/engineering/mechanical', function(req, res){
    res.render('programs/engineering/mechanical');
});

router.get('/user', function(req, res){
    res.render('user');
});

app.use('/', router);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
