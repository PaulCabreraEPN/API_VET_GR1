import connection from "./database.js";
import app from "./server.js";

connection();

app.listen(app.get('port'),() => {
    console.log(`Server OK on http://localhost:${app.get('port')}`);
});