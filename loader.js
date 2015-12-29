/* 
* purpose: load initial values
* npm install neo4j seraph restify http request q
*
*/

'use strict';

//constants
// const NEO4J_HOST = 'localhost';
// const NEO4J_PORT = 7474;
// const NEO4J_USER = 'neo4j';
// const NEO4J_PASS = 'neo';

const NEO4J_HOST = 'app45224199.sb02.stations.graphenedb.com';
const NEO4J_PORT = 24789;
const NEO4J_USER = 'app45224199';
const NEO4J_PASS = 'M50GffrBYkQqNHOk8qzE';


var BCSH = ["03-60-100", "03-60-140", "03-60-141", "03-60-212", "03-60-214", "03-60-231", "03-60-254", "03-60-256", "03-60-265", "03-60-266", "03-60-311", "03-60-315", "03-60-322", "03-60-330", "03-60-354", "03-60-367", "03-60-440", "03-60-454", 
"03-60-496", "03-62-140", "03-62-141", "03-62-190", "03-62-369", "03-65-205"];

const GET_PREREQ_RELATION_QUERY =
	   "MATCH (p1:Course)<--(p2:Course) \
		WHERE p2.code =~ {code} \
		WITH DISTINCT p2 \
		MATCH (p1)<--(p2:Course) \
		RETURN DISTINCT p1"

const QUERY_FILTER_COURES_IN_ARRAY =
	   "MATCH (n) \
		WHERE n.code IN {code} \
		RETURN n"

//imports
var q = require ('q');
var http = require('http');
var neo4j   = require('neo4j');
var restify = require('restify');
var request = require("request");
var db = require('seraph')({
  server: 'http://' + NEO4J_HOST + ':' + NEO4J_PORT,
  user: NEO4J_USER,
  pass: NEO4J_PASS,
  id: 'seraph'
});

// todo restify
var server = restify.createServer({
    name: 'CourseSequence',
    version: '1.0.0'
});

db.simple = function(query){
  db.query(query, function(err, results) {
  	if (err) { return err; }
    	return results;
  });
}

// DELETE all nodes before starting
// WARNING - DESTRUCTIVE

q.fcall(function(delet){
db.simple([
	  'MATCH (n)',
	  'OPTIONAL MATCH (n)-[r]-() ',
	  'DELETE n, r;'
	].join('\n'))
}).then(function(results_courses) {
	var query = [
'CREATE (c03_60_100: Course{id:"60100", code:"03-60-100", name: "Key Concepts in Computer Science", reqs:"", load:"3 lecture hours and 1.5 laboratory hours a week"})',
'CREATE (c03_60_104: Course{id:"60104", code:"03-60-104", name: "Computer Concepts for End-Users", reqs:"", notes:"(May not be used to fulfill the major requirements of any major or joint major in Computer Science.)", load: "3 lecture hours"})',
'CREATE (c03_60_106: Course{id:"60106", code:"03-60-106", name: "Programming in C for Beginners", reqs:"Antirequisite: 03-60-140", load:"3 lecture hours"})',
'CREATE (c03_60_141: Course{id:"60141", code:"03-60-141", name: "Introduction to Algorithms and Programming II", load: "3 lecture and 1.5 laboratory hours a week", reqs:"Prerequisites: 03-60-100 (or 03-62-140) and 03-60-140"})', //60-100 (or 62-140) and 60-140
'CREATE (c03_60_140: Course{id:"60140", code:"03-60-140", name:"Introduction to Algorithms and Programming I ", reqs:"", notes:"", load:" lecture hours and 1.5 laboratory hours a week"})',
'CREATE (c03_60_205: Course{id:"60205", code:"03-60-205", name:"Introduction to the Internet", reqs:"Prerequisite: 03-60-104 or 03-60-106 or 03-60-140.) ", notes:"not be used to fulfill the major requirements of any major or joint major in Computer Science.", load:"(3 lecture hours a week)"})',
'CREATE (c03_60_207: Course{id:"60207", code:"03-60-207", name:"Problem Solving and Information on the Internet", reqs:"(Prerequisites 03-60-104 and 03-60-205.) ", notes:"", load:" course may not be taken to fulfill the major requirements of any major or joint major in Computer Science.", load:"3 lecture hours a week"})',
'CREATE (c03_60_209: Course{id:"60209", code:"03-60-209", name:"Social Media and Mobile Technology for End Users", reqs:"", notes:"This course may not be taken to fulfill the major requirements of any major or joint major in Computer Science.", load:"(3 lecture hours a week.)"})',
'CREATE (c03_60_212: Course{id:"60212", code:"03-60-212", name:"Object-Oriented Programming Using Java", reqs:"Prerequisite: 03-60-141.", notes:"", load:"(3 lecture hours and 1.5 laboratory hours a week)"})',
'CREATE (c03_60_214: Course{id:"60214", code:"03-60-214", name:"Computer Languages, Grammars, and Translators", reqs:"Prerequisite:03-60-100 and 03-60-212.", notes:"", load:" lecture hours and 1.5 laboratory hours a week"})',
'CREATE (c03_60_231: Course{id:"60231", code:"03-60-231", name:"Theoretical Foundations of Computer Science", reqs:"Prerequisite: 03-60-100 and 62-190.", notes:"", load:"3 lecture hours and 1.5 laboratory hours a week"})',
'CREATE (c03_60_254: Course{id:"60254", code:"03-60-254", name:"Data Structures and Algorithms", reqs:"Prerequisite: 03-60-100 and 03-60-141.", notes:"", load:"3 lecture hours and 1.5 laboratory hours a week"})',
'CREATE (c03_60_256: Course{id:"60256", code:"03-60-256", name:"Systems Programming", reqs:"Prerequisite: 03-60-141.)", notes:"", load:"3 lecture hours and 1.5 laboratory hours a week"})',
'CREATE (c03_60_265: Course{id:"60265", code:"03-60-265", name:"Computer Architecture I: Digital Design", reqs:"Prerequisite: 03-60-140.) ", notes:"", load:"3 lecture hours and 1.5 laboratory hours a week"})',
'CREATE (c03_60_266: Course{id:"60266", code:"03-60-266", name:"Computer Architecture II: Microprocessor Programming", reqs:"Prerequisite: 03-60-265).", notes:"", load:"3 lecture hours and 1.5 laboratory hours a week"})',
'CREATE (c03_60_270: Course{id:"60270", code:"03-60-270", name:"Advanced Web Design, Construction, and Deployment", reqs:"Prerequisite: 03-60-205.", notes:"", load:"3 lecture hours a week)"})',
'CREATE (c03_60_275: Course{id:"60275", code:"03-60-275", name:"Selected Topics I", reqs:"Prerequisite: 03-60-100 or 62-140, and 03-60-141.) (May be repeated for credit if content changes.) (3 lecture hours or equivalent.)", notes:"", load:""})',
'CREATE (c03_60_280: Course{id:"60280", code:"03-60-280", name:"Software Development", reqs:"Prerequisite: 03-60-212.", notes:"", load:"3 lecture hours and 1.5 laboratory hours a week.)"})',
'CREATE (c03_60_305: Course{id:"60305", code:"03-60-305", name:"Cyber-Ethics", reqs:"Prerequisites: 03-60-104 and 03-60-205", notes:"3 lecture hours a week", load:""})',
'CREATE (c03_60_307: Course{id:"60307", code:"03-60-307", name:"Web-Based Data Management", reqs:"Prerequisite: 03-60-270", notes:"This course may not be taken to fulfill the major requirements of any major or joint major in Computer Science.) (3 lecture hours a week.)", load:""})',
'CREATE (c03_60_311: Course{id:"60311", code:"03-60-311", name:"Introduction to Software Engineering", reqs:"Prerequisite: 03-60-212 and 03-60-254.)(3 lecture hours a week", notes:"", load:""})',
'CREATE (c03_60_315: Course{id:"60315", code:"03-60-315", name:"Database Management Systems", reqs:"Prerequisite: 03-60-254 and 03-60-256 or 03-60-265.) (3 lecture hours a week", notes:"", load:""})',
'CREATE (c03_60_322: Course{id:"60322", code:"03-60-322", name:"Object-Oriented Software Analysis and Design", reqs:"Prerequisite: 03-60-212 and 03-60-254)", notes:"", load:"3 lecture hours a week"})',
'CREATE (c03_60_330: Course{id:"60330", code:"03-60-330", name:"Operating Systems Fundamentals", reqs:"Prerequisite: 03-60-212, 03-60-254, 03-60-256, and 03-60-265 or 03-60-266.)", notes:"", load:"3 lecture hours a week"})',
'CREATE (c03_60_334: Course{id:"60334", code:"03-60-334", name:"World Wide Web Information Systems Development", reqs:"Prerequisite: 03-60-212 and 03-60-254.)", notes:"", load:"3 lecture hours a week"})',
'CREATE (c03_60_340: Course{id:"60340", code:"03-60-340", name:"Advanced Object Oriented System Design Using C++", reqs:"Prerequisites: 03-60-212, 03-60-256", notes:"", load:"3 lecture hours a week)"})',
'CREATE (c03_60_350: Course{id:"60350", code:"03-60-350", name:"Introduction to Multimedia Systems", reqs:"Prerequisite: 03-60-254 and 03-60-265", notes:"", load:"3 lecture hours a week)"})',
'CREATE (c03_60_352: Course{id:"60352", code:"03-60-352", name:"Introduction to Computer Graphics", reqs:"Prerequisite: 03-60-254 and 62-120", notes:"", load:" lecture hours a week)"})',
'CREATE (c03_60_354: Course{id:"60354", code:"03-60-354", name:"Theory of Computation", reqs:"Prerequisites: 03-60-214, 03-60-231 and 03-60-254", notes:"", load:" lecture hours a week)"})',
'CREATE (c03_60_367: Course{id:"60367", code:"03-60-367", name:"Computer Networks", reqs:"Prerequisite: 03-60-212, 03-60-254, 03-60-256 and 03-60-265. Recommended corequisite: 03-60-330.", notes:"", load:"3 lecture hours a week"})',
'CREATE (c03_60_368: Course{id:"60368", code:"03-60-368", name:"Network Practicum", reqs:"Prerequisite: 03-60-330 and 03-60-367", notes:"", load:"1.5 lecture hours and 1.5 lab hours a week."})',
'CREATE (c03_60_371: Course{id:"60371", code:"03-60-371", name:"Artificial Intelligence Concepts", reqs:"Prerequisites:03-60-254 and (65-205 or 65-250", notes:"", load:" lecture hours a week"})',
'CREATE (c03_60_375: Course{id:"60375", code:"03-60-375", name:"Selected Topics", reqs:"Prerequisite: 03-60-212, 03-60-254, and 03-60-256. Additiona", notes:"May be repeated for credit if content changes.", load:"3 lecture hours or equivalent a week"})',
'CREATE (c03_60_376: Course{id:"60376", code:"03-60-376", name:"Selected Topics", reqs:"Prerequisite: 03-60-212, 03-60-254, and 03-60-256. Additiona", notes:"May be repeated for credit if content changes.", load:"3 lecture hours or equivalent a week"})',
'CREATE (c03_60_377: Course{id:"60377", code:"03-60-377", name:"Game Design, Development and Tools", reqs:"Prerequisites: 60:254, 03-60-212", notes:"", load:"3 lecture hours a week"})',
'CREATE (c03_60_411: Course{id:"60411", code:"03-60-411", name:"Software Verification and Testing", reqs:"Prerequisites: 03-60-311 and 03-60-330", load:"3 lecture hours a week)", notes:""})',
'CREATE (c03_60_415: Course{id:"60415", code:"03-60-415", name:"Advanced and Practical Database Systems", reqs:"Prerequisites: 03-60-315 and 03-60-330.", load:"(3 lecture hours a week)", notes:""})',
'CREATE (c03_60_420: Course{id:"60420", code:"03-60-420", name:"Mobile Application Development", reqs:"Prerequisites: 03-60-315, 03-60-322.) (3 lecture hours a week.", load:"", notes:""})',
'CREATE (c03_60_422: Course{id:"60422", code:"03-60-422", name:"Agile Software Development", reqs:"Prerequisite: 03-60-322", load:"3 lecture hours a week", notes:""})',
'CREATE (c03_60_425: Course{id:"60425", code:"03-60-425", name:"Oracle Database Design and Administration", reqs:"Prerequisite: 03-60-315", load:"1.5 lecture hours and 1.5 laboratory hours a week", notes:""})',
'CREATE (c03_60_440: Course{id:"60440", code:"03-60-440", name:"Principles of Programming Languages", reqs:"Prerequisite: 03-60-214, 03-60-231 and 03-60-254", load:"3 lecture hours a week)", notes:""})',
'CREATE (c03_60_450: Course{id:"60450", code:"03-60-450", name:"Multimedia System Development", reqs:"Prerequisite: 03-60-350 or consent of instructor", load:"3 lecture hours a week)", notes:""})',
'CREATE (c03_60_454: Course{id:"60454", code:"03-60-454", name:"Design and Analysis of Computer Algorithms", reqs:"Prerequisite: 03-60-231, 03-60-254 and 03-60-354", load:"(3 lecture hours a week)", notes:""})',
'CREATE (c03_60_460: Course{id:"60460", code:"03-60-460", name:"Digital Design and Computer Architecture", reqs:"Prerequisite:03-60-265 or 03-60-266, 03-60-330 and 03-60-367", load:"3 lecture hours a week", notes:""})',
'CREATE (c03_60_467: Course{id:"60467", code:"03-60-467", name:"Network Security", reqs:"Prerequisites: 03-60-367", load:"3 lecture hours a week", notes:""})',
'CREATE (c03_60_468: Course{id:"60468", code:"03-60-468", name:"Advanced Networking", reqs:"Prerequisites: 03-60-367 and 03-60-368", load:"", notes:""})',
'CREATE (c03_60_470: Course{id:"60470", code:"03-60-470", name:"Project Using Selected Tools", reqs:"Prerequisite: 03-60-315, 03-60-322, and 03-60-330", load:"3 lecture hours or equivalent a week", notes:""})',
'CREATE (c03_60_473: Course{id:"60473", code:"03-60-473", name:"Advanced Topics in Artificial Intelligence I", reqs:"Prerequisite: 03-60-371", load:"3 lecture hours a week", notes:""})',
'CREATE (c03_60_474: Course{id:"60474", code:"03-60-474", name:"Advanced Topics in Artificial Intelligence II", reqs:"Prerequisite: 03-60-371", load:"3 lecture hours a week", notes:""})',
'CREATE (c03_60_475: Course{id:"60475", code:"03-60-475", name:"Selected Topics", reqs:"3 lecture hours or equivalent a wee", load:"May be repeated for credit if content changes.", notes:""})',
'CREATE (c03_60_476: Course{id:"60476", code:"03-60-476", name:"Selected Topics", reqs:"(3 lecture hours or equivalent a week", load:"", notes:"May be repeated for credit if content changes.) "})',
'CREATE (c03_60_477: Course{id:"60477", code:"03-60-477", name:"Artificial Intelligence for Games", reqs:"Prerequisite: 03-60-377.", load:"3 lecture hours a week", notes:"(This course could be used to satisfy the 03-60-473 (fourth year AI) requirement.) (Restricted to students in Honours Computer Science.)"})',
'CREATE (c03_60_480: Course{id:"60480", code:"03-60-480", name:"Selected Topics in Software Engineering", reqs:"Prerequisite: 03-60-311, 03-60-322 and 03-60-330", load:"3 lecture hours a week", notes:""})',
'CREATE (c03_60_496: Course{id:"60496", code:"03-60-496", name:"Research Project", reqs:"Anti-requisite 03-60-499", load:"3 lecture hours or equivalent a week, for two terms", notes:""})',
'CREATE (c03_60_499: Course{id:"60499", code:"03-60-499", name:"Project Management: Techniques and Tools", reqs:"(Antirequisite: 03-60-496.", load:"3 lecture hours or equivalent a week, for two terms.", notes:""})',

'CREATE (c03_60_141) -[:Prerequisite]-> (c03_60_140)',
'CREATE (c03_60_141) -[:Prerequisite]-> (c03_60_100)',

'CREATE (c03_60_205) -[:Prerequisite]-> (c03_60_104)',

'CREATE (c03_60_207) -[:Prerequisite]-> (c03_60_104)',
'CREATE (c03_60_207) -[:Prerequisite]-> (c03_60_205)',

'CREATE (c03_60_212) -[:Prerequisite]-> (c03_60_141)',

'CREATE (c03_60_214) -[:Prerequisite]-> (c03_60_100)',
'CREATE (c03_60_214) -[:Prerequisite]-> (c03_60_212)',

'CREATE (c03_60_231) -[:Prerequisite]-> (c03_60_100)',
// 'CREATE (c03_60_231) -[:Prerequisite]-> (c03_62_190)',

'CREATE (c03_60_254) -[:Prerequisite]-> (c03_60_100)',
'CREATE (c03_60_254) -[:Prerequisite]-> (c03_60_141)',

'CREATE (c03_60_256) -[:Prerequisite]-> (c03_60_141)',
'CREATE (c03_60_265) -[:Prerequisite]-> (c03_60_140)',
'CREATE (c03_60_266) -[:Prerequisite]-> (c03_60_265)',

'CREATE (c03_60_270) -[:Prerequisite]-> (c03_60_205)',
'CREATE (c03_60_275) -[:Prerequisite]-> (c03_60_100)',
'CREATE (c03_60_275) -[:Prerequisite]-> (c03_60_141)',

'CREATE (c03_60_280) -[:Prerequisite]-> (c03_60_212)',

'CREATE (c03_60_305) -[:Prerequisite]-> (c03_60_104)',
'CREATE (c03_60_305) -[:Prerequisite]-> (c03_60_205)',

'CREATE (c03_60_307) -[:Prerequisite]-> (c03_60_270)',
'CREATE (c03_60_311) -[:Prerequisite]-> (c03_60_212)',
'CREATE (c03_60_311) -[:Prerequisite]-> (c03_60_254)',

'CREATE (c03_60_315) -[:Prerequisite]-> (c03_60_254)',
'CREATE (c03_60_315) -[:Prerequisite]-> (c03_60_256)',
'CREATE (c03_60_315) -[:Prerequisite]-> (c03_60_265)',

'CREATE (c03_60_322) -[:Prerequisite]-> (c03_60_212)',
'CREATE (c03_60_322) -[:Prerequisite]-> (c03_60_254)',

'CREATE (c03_60_330) -[:Prerequisite]-> (c03_60_212)',
'CREATE (c03_60_330) -[:Prerequisite]-> (c03_60_254)',
'CREATE (c03_60_330) -[:Prerequisite]-> (c03_60_256)',
'CREATE (c03_60_330) -[:Prerequisite]-> (c03_60_265)',

'CREATE (c03_60_334) -[:Prerequisite]-> (c03_60_212)',
'CREATE (c03_60_334) -[:Prerequisite]-> (c03_60_254)',

'CREATE (c03_60_340) -[:Prerequisite]-> (c03_60_212)',
'CREATE (c03_60_340) -[:Prerequisite]-> (c03_60_256)',

'CREATE (c03_60_350) -[:Prerequisite]-> (c03_60_254)',
'CREATE (c03_60_350) -[:Prerequisite]-> (c03_60_265)',

'CREATE (c03_60_352) -[:Prerequisite]-> (c03_60_254)',
// 'CREATE (c03_60_352) -[:Prerequisite]-> (c03_62_120)',

'CREATE (c03_60_354) -[:Prerequisite]-> (c03_60_214)',
'CREATE (c03_60_354) -[:Prerequisite]-> (c03_60_231)',
'CREATE (c03_60_354) -[:Prerequisite]-> (c03_60_254)',

'CREATE (c03_60_367) -[:Prerequisite]-> (c03_60_212)',
'CREATE (c03_60_367) -[:Prerequisite]-> (c03_60_254)',
'CREATE (c03_60_367) -[:Prerequisite]-> (c03_60_256)',
'CREATE (c03_60_367) -[:Prerequisite]-> (c03_60_265)',

'CREATE (c03_60_367) -[:Corequisite]-> (c03_60_330)',

'CREATE (c03_60_368) -[:Prerequisite]-> (c03_60_330)',
'CREATE (c03_60_368) -[:Prerequisite]-> (c03_60_367)',

// 'CREATE (c03_60_371) -[:Prerequisite]-> (c03_65_205)',
'CREATE (c03_60_371) -[:Prerequisite]-> (c03_60_254)',

'CREATE (c03_60_375) -[:Prerequisite]-> (c03_60_212)',
'CREATE (c03_60_375) -[:Prerequisite]-> (c03_60_254)',
'CREATE (c03_60_375) -[:Prerequisite]-> (c03_60_256)',

'CREATE (c03_60_376) -[:Prerequisite]-> (c03_60_212)',
'CREATE (c03_60_376) -[:Prerequisite]-> (c03_60_254)',
'CREATE (c03_60_376) -[:Prerequisite]-> (c03_60_256)',

'CREATE (c03_60_377) -[:Prerequisite]-> (c03_60_212)',
'CREATE (c03_60_377) -[:Prerequisite]-> (c03_60_254)',

'CREATE (c03_60_411) -[:Prerequisite]-> (c03_60_311)',
'CREATE (c03_60_411) -[:Prerequisite]-> (c03_60_330)',

'CREATE (c03_60_415) -[:Prerequisite]-> (c03_60_330)',
'CREATE (c03_60_415) -[:Prerequisite]-> (c03_60_315)',

'CREATE (c03_60_420) -[:Prerequisite]-> (c03_60_315)',
'CREATE (c03_60_420) -[:Prerequisite]-> (c03_60_322)',

'CREATE (c03_60_422) -[:Prerequisite]-> (c03_60_322)',

'CREATE (c03_60_425) -[:Prerequisite]-> (c03_60_315)',

'CREATE (c03_60_440) -[:Prerequisite]-> (c03_60_214)',
'CREATE (c03_60_440) -[:Prerequisite]-> (c03_60_231)',
'CREATE (c03_60_440) -[:Prerequisite]-> (c03_60_254)',

'CREATE (c03_60_450) -[:Prerequisite]-> (c03_60_350)',

'CREATE (c03_60_454) -[:Prerequisite]-> (c03_60_231)',
'CREATE (c03_60_454) -[:Prerequisite]-> (c03_60_254)',
'CREATE (c03_60_454) -[:Prerequisite]-> (c03_60_354)',

'CREATE (c03_60_460) -[:Prerequisite]-> (c03_60_265)',
'CREATE (c03_60_460) -[:Prerequisite]-> (c03_60_330)',
'CREATE (c03_60_460) -[:Prerequisite]-> (c03_60_367)',

'CREATE (c03_60_467) -[:Prerequisite]-> (c03_60_367)',
'CREATE (c03_60_468) -[:Prerequisite]-> (c03_60_367)',
'CREATE (c03_60_468) -[:Prerequisite]-> (c03_60_368)',

'CREATE (c03_60_470) -[:Prerequisite]-> (c03_60_315)',
'CREATE (c03_60_470) -[:Prerequisite]-> (c03_60_322)',
'CREATE (c03_60_470) -[:Prerequisite]-> (c03_60_330)',

'CREATE (c03_60_473) -[:Prerequisite]-> (c03_60_371)',
'CREATE (c03_60_474) -[:Prerequisite]-> (c03_60_371)',
'CREATE (c03_60_475) -[:Prerequisite]-> (c03_60_368)',

'CREATE (c03_60_477) -[:Prerequisite]-> (c03_60_377)',
'CREATE (c03_60_480) -[:Prerequisite]-> (c03_60_311)',
'CREATE (c03_60_480) -[:Prerequisite]-> (c03_60_322)',
'CREATE (c03_60_480) -[:Prerequisite]-> (c03_60_330)',

'CREATE (c03_60_496) -[:Antirequisite]-> (c03_60_499)',
'CREATE (c03_60_499) -[:Antirequisite]-> (c03_60_496)',
	].join('\n');
	db.query(query, function(err, results) {
	  if (err) { console.log(err); return; }
	    // console.log(results);
	});
}).then(function(test) {

var t = ["asdf"];

q.fcall(function(){
	// console.log(BCSH);
	// BCSH.forEach(function(i){
	// 	rackCourse(i, function(output){
	// 		t = t.concat(output);
	// 	});
	// });


})
.then(function (){

	console.log(t);
	filterCourses(BCSH, function(r){
		console.log(r);
	});
})
.catch(function (error) {
})
.done();


}).catch(function(err) {
	if(err !== undefined) console.log(err);
}).done();

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

function Y(le) {
    return function (f) {
        return f(f);
    }(function (f) {
        return le(function (x) {
            return f(f)(x);
        });
    });
}
