/**
 * LS-8 v2.0 emulator skeleton code
 */

const fs = require('fs');

// Instructions

const HLT  = 0b00000001; // Halt CPU
const ADD  = 0b10101000; //ADD R R
const MUL  = 0b10101010; //MUL R R
const LDI  = 0b10011001; // LDI R value 
const PRN  = 0b01000011; // PRN R
const NOP  = 0b00000000; // NOP
const PUSH = 0b01001101; // PUSH
const POP  = 0b01001100; //POP 
const SP = 7;
// !!! IMPLEMENT ME
// LDI
// MUL
// PRN

/**
 * Class for simulating a simple Computer (CPU & memory)
 */
class CPU {

    /**
     * Initialize the CPU
     */
    constructor(ram) {
        this.ram = ram;

        this.reg = new Array(8).fill(0); // General-purpose registers
        
        // Special-purpose registers
        this.reg.PC = 0; // Program Counter stores the index of the memory instruction
        this.reg.IR = 0; // Instruction Register stores the actual content of the index in the PC

        //initialize the stack pointer
        this.reg[SP] = 0xf3

		this.setupBranchTable();
    }
	
	/**
	 * Sets up the branch table
	 */
	setupBranchTable() {
		let bt = {};

        bt[HLT] = this.HLT;
        bt[ADD] = this.ADD;
        bt[MUL] = this.MUL;
        bt[LDI] = this.LDI;
        bt[PRN] = this.PRN;
        bt[NOP] = this.NOP;
        // !!! IMPLEMENT ME
        // LDI
        // MUL
        // PRN

		this.branchTable = bt;
	}

    /**
     * Store value in memory address, useful for program loading
     */
    poke(address, value) {
        this.ram.write(address, value);
    }

    /**
     * Starts the clock ticking on the CPU
     */
    startClock() {
        const _this = this;

        this.clock = setInterval(() => {
            _this.tick();
        }, 1);
    }

    /**
     * Stops the clock
     */
    stopClock() {
        clearInterval(this.clock);
    }

    /**
     * ALU functionality
     * 
     * op can be: ADD SUB MUL DIV INC DEC CMP
     */
    alu(op, regA, regB) {
        switch (op) {
            case 'MUL':
                // !!! IMPLEMENT ME
                this.reg[regA] = this.reg[regA] * this.reg[regB]
                break;
            case 'ADD':
                this.reg[regA] = this.reg[regA] + this.reg[regB]
                break;
                

        }
    }

    /**
     * Advances the CPU one cycle
     */
    tick() {
        // Load the instruction register (OR) from the current PC
        // !!! IMPLEMENT ME
        this.reg.IR = this.ram.read(this.reg.PC);

        // Debugging output
        //console.log(`${this.reg.PC}: ${this.reg.IR.toString(2)}`);

        // Based on the value in the Instruction Register, locate the
        // appropriate hander in the branchTable
        // !!! IMPLEMENT ME
         let handler = this.branchTable[this.reg.IR];

        // Check that the handler is defined, halt if not (invalid
        // instruction)
        // !!! IMPLEMENT ME
        if(handler === undefined ) {
            console.error('Unknown opcode' + this.reg.IR);
            this.stopClock();
            return;
        }

        // Read OperandA and OperandB
        let operandA = this.ram.read(this.reg.PC + 1)
        let operandB = this.ram.read(this.reg.PC + 2)

        // We need to use call() so we can set the "this" value inside
        // the handler (otherwise it will be undefined in the handler)
        handler.call(this, operandA, operandB);

        // Increment the PC register to go to the next instruction
        // !!! IMPLEMENT ME
        this.reg.PC += ((this.reg.IR >> 6) & 0b00000011) + 1;
    }

    // INSTRUCTION HANDLER CODE:

    /* ADD 
      */
     ADD(regA, reagB) {
        this.alu('ADD', regA, regB);
    }

    /**
     * HLT
     */
    HLT() {
        // !!! IMPLEMENT ME
        this.stopClock();
    }

    /**
     * LDI R,I
     */
    LDI(regNum, value) {
        // !!! IMPLEMENT ME
       this.reg[regNum] = value;
    }

    /**
     * MUL R,R
     */
    MUL(regA, regB) {
        // !!! IMPLEMENT ME
        this.alu('MUL', regA, regB);
    }

    /**
     * PRN R
     */
    PRN(regA) {
        // !!! IMPLEMENT ME
        console.log(this.reg[regA]);
    }
    NOP() {
        return;
    }
    

    CALL(regNum) {
        //Push next address on stack
      pushHelper(this.reg.PC + 2)
    }

    pushHelper() {
        // push helper method
        this.reg[SP] = this.reg[SP] - 1;
        this.ram.write(this.reg[SP], value);
    }

    popHelper() {
        this.ram.write(this.reg[SP], value);
        this.reg[SP] = this.reg[SP] + 1;
    }

    PUSH(regNum) {
       let value = this.reg[regNum];
       
       pushHelper(value);
    }

    POP(regNum) {
        this.value = this.reg[regNum];

    }
}

module.exports = CPU;
