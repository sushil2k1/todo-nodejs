//letest wala
const express=require('express');
const app=express();
let fs=require('fs')
app.use(express.static("public"));
app.use(express.json());

app.get(`/`,(req,res)=>{
    
        res.sendFile(__dirname+"/public/index.html");

    
   
})
app.post('/savetodo', (req, res) => {
    let todos;
    fs.readFile('./task.txt', 'utf-8', (err, data) => {
        if (data.length == 0) {
            todos = [];
        }
        else {
            todos = JSON.parse(data);
        }
        todos.push(req.body);
        fs.writeFile('./task.txt', JSON.stringify(todos), (err) => {
            res.end();
        })

    })

})

app.get('/getdata', (req, res) => {
    fs.readFile('./task.txt', 'utf-8', (err, data) => {
        if (data) {
            todos = JSON.parse(data);
        }
        else {
            todos = [];
        }
        res.status(200).json(todos);
     
    })
})



let arr=[];
app.post('/delete',(req,res)=>{
    let todos;
    fs.readFile('./task.txt', 'utf-8', (err, data) => {
        if (data.length == 0) {
            todos = [];
        }
        else {
            todos = JSON.parse(data);
        }
        // console.log("from delete",todos);
        arr=todos;
        
        deleteFromServer(arr,req.body.id);
        res.status(200).json({msg:"successfully deleted"})
    })
})


app.post(`/donetask/:id`,(req,res)=>{
    console.log(req.params);
    let id=req.params;
    let todos;
    fs.readFile('./task.txt', 'utf-8', (err, data) => {
        if (data.length == 0) {
            todos = [];
        }
        else {
            todos = JSON.parse(data);
        }
        arr=todos;
        
        check(arr,id);
        res.status(200).json({msg:"successfully deleted"})
    })
})

app.post(`/updateTask/:id/:value`,(req,res)=>{
    console.log(req.params);
    let id=req.params.id;
    let val=req.params.value;
    let todos;
    fs.readFile('./task.txt', 'utf-8', (err, data) => {
        if (data.length == 0) {
            todos = [];
        }
        else {
            todos = JSON.parse(data);
        }
        arr=todos;
        
        update(arr,id,val)
        res.status(200).json({msg:"successfully updated"})
    })
})





app.listen(2000,()=>{
    console.log(`server is running on port http://localhost:2000`);
})

function deleteFromServer(arr,id){
   
    let index=arr.findIndex((e)=>e.id==id);
    arr.splice(index,1);
    fs.writeFile('./task.txt',JSON.stringify(arr),(err)=>{
    })
}

function check(a,id){
    let index=a.findIndex((e)=>e.id==id.id);
    console.log(a);
    // console.log("index from check function",index);
    if(a[index].checked==false)
    a[index].checked=true;
else
a[index].checked=false;

    fs.writeFile('./task.txt',JSON.stringify(a),(err)=>{
    })
}

function update(a,id,val){
    let index=a.findIndex((e)=>e.id==id);
    a[index].task=val;
    fs.writeFile('./task.txt',JSON.stringify(a),(err)=>{
        console.error( err);
    })
}