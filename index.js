import express from "express";
import fs from 'fs';

const app = express();

app.use(express.json());

const readFile = (path) => {
    return JSON.parse(fs.readFileSync(path, "utf8"));
};

const writeFunc = (err) => {
    // Checking for errors
    if (err) throw err;
};

const writeToFileSingleObject = (path, obj) => {
    const fileArray = readFile(path);
    fileArray.push(obj);
    fs.writeFile(path, JSON.stringify(fileArray), writeFunc);
    console.log("Done writing single object"); // Success
    return fileArray
};

const writeToFileArray = (path, arr) => {
    fs.writeFile(path, JSON.stringify(arr), writeFunc);
    console.log("Done writing array"); // Success
};


const deleteFromFile = (path, id) => {
    const fileArray = readFile(path);
    const itemToBeDeletedIndex = fileArray.findIndex((item) => item.id === +id);
    const clone = [...fileArray];
    clone.splice(itemToBeDeletedIndex, 1);
    writeToFileArray(path, clone);
    return clone;
};

const updateFile = (path, id, updatedObj) => {
    const fileArray = readFile(path);
    const itemToBeUpdated = fileArray.findIndex(item => item.id === +id);
    const clone = [...fileArray];
    for (const key in updatedObj) {
        clone[itemToBeUpdated][key] = updatedObj[key];
    }
    writeToFileArray(path, clone);
    return clone;
}

/***************************************************************************************************/

app.get("/", (req, res) => res.send(readFile("./todos.json")));

app.get("/todo/:id", (req, res) => {
    const fileArray = readFile("./todos.json");
    const id = req.params.id;
    const desiredTodo = fileArray.find(todo => todo.id===parseInt(id));
    console.log(desiredTodo);
    res.send(desiredTodo);
})

app.post("/", (req, res)=>{
    const obj = {...req.body};
    console.log("obj", obj);
    if(Object.keys(obj).length === 0 ){
        res.send("failed");
    }
    const answer = writeToFileSingleObject("./todos.json", obj);
    res.send(answer);
})

app.put("/todo/:id", (req, res) => {
    const id = req.params.id;
    const obj = {...req.body};
    const answer = updateFile("./todos.json", id, obj);
    res.send(answer);
})

app.delete("/todo/:id", (req, res) => {
    const id = req.params.id;
    const answer = deleteFromFile("./todos.json", id);
    res.send(answer)
})

app.listen(8001, () => {
    console.log("Example app listening on port 8001!");
});