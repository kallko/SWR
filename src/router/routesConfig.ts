import { GuildTop } from "./Guild/GuildTop";
import { Home } from "./Home/Home";
import { Mods } from "./Mods/Mods";
import {GACheck} from "./Guild/GACheck";
import {ColorUp} from "./Mods/ColorUp";
import {Guild} from "./Guild/Guild";
import {LegendProgress} from "./Guild/LegendProgress";
import {ApiDoc} from "./ApiDoc/ApiDoc";
import {Sysadmin} from "./Sysadmin/Sysadmin";

export const ROUTES = [
    {
        path: "/home",
        component: Home
    },
    {
        path: "/mods",
        component: Mods,
        routes: [
            {
                path: "/mods/gacheck",
                component: GACheck
            },
            {
                path: "/mods/colorup",
                component: ColorUp
            }

        ]
    },
    {
        path: "/guild",
        component: Guild,
        routes: [
            {
                path: "/guild/legendprogress",
                component: LegendProgress
            },
            {
                path: "/guild/top",
                component: GuildTop
            }
        ]
    },
    {
        path: "/apidoc",
        component: ApiDoc
    },
    {
        path: "/sysadmin",
        component: Sysadmin
    }
];
