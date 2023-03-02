import { randomUUID } from 'node:crypto';
import { Database } from './database.js';
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database();

const ERROR_BODY = "Body request shoult have: 'title', 'description'"
const ERROR_INVALID_ID = "Invalid id"

const badRequest = (res, message) => {
    console.log(message)
    return res.writeHead(400)
        .end(JSON.stringify(message))
}

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query;
            console.log('Get request', { search });
            let searchTask = null;
            if (search) {
                searchTask = {
                    title: search,
                    description: search,
                }
            }
            const tasks = database.select('tasks', searchTask);
            return res.writeHead(200)
                .end(JSON.stringify(tasks));
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.body
            console.log('Post request', { title }, { description });

            if (!title || !description) return badRequest(res, ERROR_BODY);

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
            console.log('New task', { task })
            return res.writeHead(201).end(JSON.stringify(task));
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { title, description } = req.body;
            const { id } = req.params;
            console.log('Put request', { id }, { title }, { description })

            if (!title || !description) return badRequest(res, ERROR_BODY);

            const rowIndex = database.verifyId('tasks', id);
            if (rowIndex < 0) return badRequest(res, ERROR_INVALID_ID);

            const task = database.update('tasks', rowIndex, { title, description, updated_at: Date.now() });
            console.log('Updated task'), { task }
            return res.writeHead(201)
                .end(JSON.stringify(task));
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params;
            console.log('Patch request', { id });

            const rowIndex = database.verifyId('tasks', id);
            if (rowIndex < 0) return badRequest(res, ERROR_INVALID_ID);

            const now = Date.now();
            const task = database.update('tasks', rowIndex, { updated_at: now, completed_at: now });
            console.log('Completed task'), { task }
            return res.writeHead(201)
                .end(JSON.stringify(task));
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params;
            console.log('Delete request', { id });

            const rowIndex = database.verifyId('tasks', id);
            if (rowIndex < 0) return badRequest(res, ERROR_INVALID_ID);


            database.delete('tasks', rowIndex);
            return res.writeHead(204).end();
        }
    }
]
