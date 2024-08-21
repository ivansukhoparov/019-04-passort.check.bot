import 'reflect-metadata';
import {container} from "./composition.root";
import {App} from "./app";


const app: App = container.resolve<App>(App)
app.start()

