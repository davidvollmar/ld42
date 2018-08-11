import { Coordinate } from "./world";

export class Sheep {
    private position: Coordinate
    private angle: number

    constructor(position: Coordinate, angle: number) {
        console.log("baah")
        this.position = position
        this.angle = angle
    }

    getPosition() {
        return this.position
    }

    getAngle() {
        return this.angle
    }
}