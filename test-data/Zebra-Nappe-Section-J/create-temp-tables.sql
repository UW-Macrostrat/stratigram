DROP SCHEMA IF EXISTS stratiform_import CASCADE;
CREATE SCHEMA stratiform_import;

CREATE TABLE stratiform_import.lithology (
  id text,
  name text,
  member_of text,
  pattern text
);

CREATE TABLE stratiform_import.facies (
  id text NOT NULL,
  name text NOT NULL,
  description text,
  color text,
  member_of text
);

CREATE TABLE stratiform_import.surface (
  height numeric NOT NULL,
  lithology text,
  grainsize text,
  covered boolean,
  facies text,
  definite_boundary boolean
);

CREATE TABLE stratiform_import.note (
  height numeric NOT NULL,
  top_height numeric,
  note text,
  symbol text
);

INSERT INTO stratiform_import.lithology(id, name, member_of, pattern)
VALUES
('clastic','Siliciclastic', NULL, 607),
('carbonate','Carbonate',NULL, 627),
('siltstone','Siltstone', 'clastic', 616),
('sandstone','Sandstone', 'clastic', 607),
('mudstone','Mudstone', 'clastic', 620),
('shale','Shale','clastic', 620),
('limestone','Limestone','carbonate', 627),
('dolomite','Dolomite','carbonate', 642),
('dolomitic siltstone','Dolomitic siltstone','siltstone', 616),
('calcareous siltstone','Calcareous siltstone','siltstone', 616),
('conglomerate','Conglomerate','clastic', 602),
('lime mudstone','Lime mudstone','limestone', 627),
('sandy dolomite','Sandy dolomite','dolomite', 645),
('silty dolomite','Silty dolomite','dolomite', 642),
('dolomite mudstone','Dolomite mudstone','dolomite', 642);


INSERT INTO stratiform_import.facies(id, name,description,color,member_of)
VALUES
('shallow-carbonate','Shallow-water mudstone','Wavy-bedded carbonate with shallow-water bedding features','#2196f3','carbonate-mudstone'),
('wavy-grainstone','Wavy-bedded to ribbon grainstone','Ribbony, mottled grainstone with sinuous mudstone partings','#d1c4e9','mixed-grainstone'),
('mixed-grainstone','Mixed grainstone','Intraclast, cross-stratified, and massive grainstones with scoured interlayers and mudstone laminations','#4a148c','carbonate'),
('hcs-grainstone','Trough to HCS grainstone','Cross-stratified grainstone','#673ab7','carbonate'),
('intraclast-breccia','Mudstone-fill intraclast breccia','Rafted angular to tabular intraclast debries in a mudstone matrix','#880e4f','carbonate'),
('fine-clastics','Fine clastics','Mudstones, siltstones, and fine sandstones, sometimes with graded beds and cross-stratification.','#dcedc8','clastics'),
('shallow-fine-clastics','Shallow fine clastics','Siltstone to fine sandstone with shallow-water bedding features','#4db6ac',NULL),
('coarse-clastics','Coarse sandstone','Coarse-grained sandstone and pebbly conglomerate','#006064','clastics'),
('intraclast-grainstone','Intraclast grainstone','Medium to thick-bedded, likely oolitic, grainstone with mudstone rip-up chips','#7986cb','carbonate'),
('carbonate-mudstone','Wavy-laminated mudstone','Planar to wavy-laminated dolomite mudstone','#bbdefb','carbonate'),
('none','Not categorized',NULL,'#969696',NULL),
('carbonate','Carbonate',NULL,NULL,NULL),
('clastics','Clastics',NULL,NULL,NULL),
('digitate-stromatolites','Digitate stromatolites','Branching, columnar stromatolites with mudstone fill','#ff7701','carbonate');


INSERT INTO stratiform_import.surface(height, lithology, grainsize, covered, facies, definite_boundary)
VALUES
(58,'sandstone','vf',FALSE,NULL,TRUE),
(56,'siltstone','s',TRUE,NULL,TRUE),
(54,'siltstone','s',FALSE,NULL,TRUE),
(52,'siltstone','s',TRUE,'fine-clastics',TRUE),
(50.5,'sandstone','vf',FALSE,'fine-clastics',TRUE),
(49,'limestone','ms',FALSE,'digitate-stromatolites',NULL),
(46.78,NULL,NULL,FALSE,'intraclast-grainstone',TRUE),
(42.73,NULL,NULL,FALSE,'hcs-grainstone',TRUE),
(39,'limestone','m',FALSE,'mixed-grainstone',TRUE),
(37,'limestone','ms',FALSE,'digitate-stromatolites',NULL),
(35,'limestone','m',FALSE,'mixed-grainstone',TRUE),
(33.5,'limestone','ms',FALSE,NULL,NULL),
(33,'lime mudstone','ms',FALSE,'digitate-stromatolites',NULL),
(32,'siltstone','s',FALSE,NULL,NULL),
(27,'siltstone','s',TRUE,NULL,NULL),
(25,'siltstone','s',FALSE,'fine-clastics',NULL),
(23.5,'dolomite','ms',FALSE,'carbonate-mudstone',NULL),
(23,'sandstone','m',FALSE,'coarse-clastics',NULL),
(21,'siltstone','s',TRUE,'fine-clastics',NULL),
(18,'sandstone','m',FALSE,'coarse-clastics',NULL),
(16.8,'limestone','ms',FALSE,'carbonate-mudstone',NULL),
(16.2,'sandstone','m',FALSE,'coarse-clastics',NULL),
(15.4,'shale','s',TRUE,'fine-clastics',NULL),
(14.4,'dolomite','m',FALSE,'hcs-grainstone',NULL),
(14,'shale','s',TRUE,'fine-clastics',NULL),
(13,'limestone','m',FALSE,'hcs-grainstone',NULL),
(10,'sandstone','f',FALSE,'coarse-clastics',NULL),
(9.7,'lime mudstone','s',FALSE,NULL,NULL),
(7.4,'siltstone','s',FALSE,'fine-clastics',NULL),
(6,'limestone','ms',FALSE,'carbonate-mudstone',NULL),
(5.3,'siltstone','s',FALSE,'fine-clastics',NULL),
(4,'dolomite','ms',FALSE,NULL,NULL),
(2,'lime mudstone','ms',FALSE,'carbonate-mudstone',NULL),
(1,'siltstone','s',FALSE,'fine-clastics',NULL),
(0.3,'sandstone','vf',FALSE,'shallow-fine-clastics',NULL);

INSERT INTO stratiform_import.note(height,top_height,note,symbol)
VALUES
(50.5,51,'Thin to medium beds of planar to cross-laminated fine sandstone',NULL),
(49,50.5,'Orange-weathering digitate stromatolites','Digitate stromatolites'),
(37,37.5,'Poorly organized finger stromatolites and thrombolites','Digitate stromatolites'),
(5,NULL,'Jumped section 20m south to capture less-covered slope. Top of variable-thickness first dolomite taken as correlation point',NULL),
(7,NULL,NULL,NULL),
(11,NULL,NULL,NULL),
(35,NULL,'Cross-laminated lime grainstone with mudstone intraclasts',NULL),
(37,NULL,'Ooids in coarse grainstone',NULL),
(33,NULL,'Stromatolites with chaotic mud fill and some thrombolitic texture','Digitate stromatolites'),
(1,2,'Thick siltstone laminae with rippled tops and fine planar laminae',NULL),
(2,3,'2 to 8cm planar fine laminated limestone thinly interbedded with shales',NULL),
(3,4,'Shale decreases to partings upwards in this interval',NULL),
(4,5.5,'Medium to thickly laminated dolomite with internal fine laminations. Locally thins to ~20cm at 20m lateral scale',NULL),
(6,7.5,'Thickly laminated mudstone with internal fine wavy laminations ',NULL),
(7.5,10,'Thickly wavy laminated siltstone with internal fine laminations',NULL),
(10.5,NULL,'Medium lenticular interbed of very coarse somewhat immature sandstone with gutter casts',NULL),
(10,13,'Thin wavy beds of fine sandstone with fine wavy to trough cross-stratified lamination',NULL),
(13,15.5,'Thin beds of wavy to cross-laminated (fine laminae) lime/grainstone',NULL),
(16,17,'Thin planar to wavy beds of grainstone with quartz pebbles up to 1cm throughout',NULL),
(17,18,'Medium laminated lime mudstone',NULL),
(18,21,'Wavy thick laminae of medium sand with lenticular bed character and scour surfaces; some coarse lenses',NULL),
(23.5,25,'Wavy bedded lime mudstone (thin beds with internal fine laminae)',NULL),
(25,33.5,'Medium bedded green siltstone with internal fine planar laminae',NULL),
(34,35,'Planar to wavy amalgamated thick laminae of planar fine laminated mudstone',NULL),
(41.5,42.5,'Thin to medium beds of hummocky cross-stratified grainstone, mudstone, and coarse ooid grainstone with some hummocks preserved','Ooids'),
(36,NULL,'Hummocky cross-stratified grainstone with lenticular to planar mudstone bodies (internally thin to thickly laminated)',NULL),
(36,37,'Coarse oolitic hummocky cross-stratified grainstone with less abundant mud',NULL),
(37.5,38.75,'Thin wavy bedded mudstone with medium laminae of fine cross-laminated grainstone; mudstone beds are planar laminated',NULL),
(38.75,41.5,'Massive coarse ooid grainstone grading up into amalgamated thin hummocky cross-stratified beds; swaley bed top',NULL),
(42.5,46,'Thinly interbedded hummocky cross-stratified grainstone and mudstone; some fine laminae in swale-filling mudstone and grainstone',NULL),
(46,47,'Hummocky cross-stratified grainstone weathering brown/orange',NULL),
(47,49,'Grainstone with mudstone rip-up intraclasts',NULL),
(58,69,'Thin beds of very fine sand alternating with medium siltstone laminae; fine sand has internal wavy lamination',NULL),
(51,52,'Thinly bedded planar fine laminations',NULL),
(35,36,'Ooids','Hummocky cross-stratified'),
(33,34,'Wavy to lenticular limestone with thin to thick beds containing mudstone lenses, stromatolitic and thrombolitic columns, and shingled clotted texture','Digitate stromatolites'),
(14,NULL,'Covered interval',NULL),
(15.5,16,'Covered interval',NULL),
(21,23,'Covered interval',NULL),
(27,32,'Covered interval',NULL);