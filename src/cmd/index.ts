import 'module-alias/register';
import { Command } from "commander";
import { start } from "@/cmd/start";
import { register } from "@/cmd/register";

const program = new Command();

program.addCommand(start);
program.addCommand(register);

program.parse(process.argv);
