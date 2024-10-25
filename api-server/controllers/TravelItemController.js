"use strict";
import mysql from "mysql2/promise";
import { deleteCache, getCache, setCache } from "../cache/redis.js";

// db Config
const sqlHost = process.env.DB_HOST || "";
const sqlUser = process.env.DB_USER || "";
const sqlPassword = process.env.DB_PASSWORD || "";
const sqlDatabase = process.env.DB_DATABASE || "";
const sqlTable = "travel_items";

const dbConfig = {
  host: sqlHost,
  user: sqlUser,
  password: sqlPassword,
  database: sqlDatabase,
};

export const createItem = async (req, res) => {
  const { name, weight } = req.body;

  try {
    const insertQuery = `INSERT INTO ${sqlTable} (name, weight) VALUES ('${name}', '${weight}')`;
    const sqlConnection = await mysql.createConnection(dbConfig);
    sqlConnection.execute(insertQuery);

    const cacheKey = `data:travel_items`;
    await deleteCache(cacheKey);
    res.status(201).json({
      code: "success",
      message: "Travel item created",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      code: "error",
      message: "Internal server error",
    });
  }
};

export const getAllTravelItems = async (req, res) => {
  try {
    // find data from cache
    const cacheKey = "data:travel_items";
    const cacheData = await getCache(cacheKey);

    if (cacheData) {
      const result = JSON.parse(cacheData);
      res.status(200).json({
        code: "success",
        ...result,
      });
      return;
    }

    const getQuery = `SELECT * FROM ${sqlTable}`;
    const sqlConnection = await mysql.createConnection(dbConfig);
    const [data, _] = await sqlConnection.execute(getQuery);

    if (data.length !== 0) {
      const cacheKey = "data:travel_items";
      await setCache(cacheKey, data);
    }

    res.status(200).json({
      code: "success",
      isCached: false,
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      code: "error",
      message: "Internal server error",
    });
  }
};

export const deleteTravelItemById = async (req, res) => {
  const id = req.params.id;
  const deleteQuery = `DELETE FROM ${sqlTable} WHERE id = ${Number(id)}`;
  const sqlConnection = await mysql.createConnection(dbConfig);
  const [response] = await sqlConnection.execute(deleteQuery);

  try {
    if (response.affectedRows) {
      const cacheKey = `data:${id}`;
      await deleteCache(cacheKey);
      const todosKey = `data:travel_items`;
      await deleteCache(todosKey);
      res.status(200).json({
        code: "success",
        message: "Todo removed successfully!",
      });
    } else {
      res.status(404).json({
        code: "success",
        message: "Resource not found.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      code: "error",
      message: "Internal server error",
    });
  }
};

export const updateTravelItemById = async (req, res) => {
  const id = Number(req.params.id);
  const { name, weight } = req.body;

  if (!name) {
    res.status(400).json({
      code: "error",
      message: "Name field is missing",
    });
  }
  if (!weight) {
    res.status(400).json({
      code: "error",
      message: "Weight field is missing",
    });
  }

  try {
    const updateQuery = `UPDATE ${sqlTable} SET name = '${name}', weight = '${weight}' WHERE id = ${id}`;
    const sqlConnection = await mysql.createConnection(dbConfig);
    const [response] = await sqlConnection.execute(updateQuery);

    if (response.affectedRows) {
      const cacheKey = `data:${id}`;
      await deleteCache(cacheKey);
      const travelItemsKey = `data:travel_items`;
      await deleteCache(travelItemsKey);
      
      res.status(200).json({
        code: "success",
        message: "Todo updated successfully!",
      });
    } else {
      res.status(404).json({
        code: "success",
        message: "Resource not found.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      code: "error",
      message: "Internal server error",
    });
  }
};

export const getTravelItemById = async (req, res) => {
  const id = Number(req.params.id);

  try {
    // find data from cache
    const cacheKey = `data:${id}`;
    const cacheData = await getCache(cacheKey);

    if (cacheData) {
      const result = JSON.parse(cacheData);
      res.status(200).json({
        code: "success",
        ...result,
      });
      return;
    }
    const getQuery = `SELECT * FROM ${sqlTable} WHERE id = ${id}`;
    const sqlConnection = await mysql.createConnection(dbConfig);
    const [data, _] = (await sqlConnection.execute(getQuery))[0];

    if (data) {
      const cacheKey = `data:${id}`;
      await setCache(cacheKey, data);

      res.status(200).json({
        code: "success",
        isCached: false,
        data: data,
      });
    } else {
      res.status(404).json({
        code: "success",
        message: "Resource not found.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      code: "error",
      message: "Internal server error",
    });
  }
};
