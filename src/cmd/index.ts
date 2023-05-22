import 'module-alias/register';
import { Command } from "commander";
import { start } from "@/cmd/start";
import { register } from "@/cmd/register";
import { migrate } from "@/cmd/migrate";

const program = new Command();

program.addCommand(start);
program.addCommand(register);
program.addCommand(migrate);

program.parse(process.argv);
