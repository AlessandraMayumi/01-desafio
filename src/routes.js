import { randomUUID } from 'node:crypto';
import { Database } from './database.js';
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database();

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query;
            let searchTask = null
            if (search) {
                searchTask = {
                    title: search,
                    description: search,
                }
            }
            const tasks = database.select('tasks', searchTask)
            return res.writeHead(200)
                .end(JSON.stringify(tasks));
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.body
            const now = Date.now();
            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: now,
                updated_at: now,
            }
            database.insert('tasks', task);
            return res.writeHead(201).end();
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { title, description } = req.body;
            const { id } = req.params;
            database.update('tasks', id, { title, description, updated_at: Date.now() });
            return res.writeHead(201).end();
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { title, description } = req.body;
            const { id } = req.params;
            const now = Date.now();
            database.update('tasks', id, { updated_at: now, completed_at: now });
            return res.writeHead(201).end();
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params;
            database.delete('tasks', id);
            return res.writeHead(204).end();
        }
    }
]