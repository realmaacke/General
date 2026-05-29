"use strict";
import { raw } from "express";
import { items } from "../models/item.js";
export const createItem = (req, res, next) => {
    try {
        const { name } = req.body;
        const newItem = { id: Date.now(), name };
        items.push(newItem);
        res.status(201).json(newItem);
    }
    catch (error) {
        next(error);
    }
};
// Read all items
export const getItems = (req, res, next) => {
    try {
        res.json(items);
    }
    catch (error) {
        next(error);
    }
};
// Read single item
export const getItemById = (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) {
            res.status(400).send("Invalid id");
            return;
        }
        const item = items.find((i) => i.id === id);
        if (!item) {
            res.status(404).json({ message: 'Item not found' });
            return;
        }
        res.json(item);
    }
    catch (error) {
        next(error);
    }
};
// Update an item
export const updateItem = (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { name } = req.body;
        const itemIndex = items.findIndex((i) => i.id === id);
        if (itemIndex === -1) {
            res.status(404).json({ message: 'Item not found' });
            return;
        }
        items[itemIndex].name = name;
        res.json(items[itemIndex]);
    }
    catch (error) {
        next(error);
    }
};
// Delete an item
export const deleteItem = (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        const itemIndex = items.findIndex((i) => i.id === id);
        if (itemIndex === -1) {
            res.status(404).json({ message: 'Item not found' });
            return;
        }
        const deletedItem = items.splice(itemIndex, 1)[0];
        res.json(deletedItem);
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=itemController.js.map