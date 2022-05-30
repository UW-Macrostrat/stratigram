DROP SCHEMA stratiform_api CASCADE;

CREATE SCHEMA stratiform_api;

CREATE VIEW stratiform_api.project AS
SELECT * FROM stratiform.project;

CREATE VIEW stratiform_api.column AS
SELECT * FROM stratiform.column;

CREATE VIEW stratiform_api.column_surface AS
SELECT * FROM stratiform.column_surface;
