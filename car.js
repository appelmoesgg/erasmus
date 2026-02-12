export class Car{
    constructor(x, y, direction, speed, width, height, color) {
        this.direction = direction
        this.speed = speed

        this.width = width
        this.height = height

        this.x = x
        this.y = y

        switch(color){
            case 0:
                this.color = "car_blue"
                break
            case 1:
                this.color = "car_green"
                break
            case 2:
                this.color = "car_pink"
                break
            case 3:
                this.color = "car_red"
                break
            case 4:
                this.color = "car_yellow"
                break
            default:
                break
        }
    }


}

export default Car