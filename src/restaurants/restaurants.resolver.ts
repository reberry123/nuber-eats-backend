import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { RestaurantService } from "./restaurants.service";
import { Restaurant } from "./entities/restaurants.entity";
import { CreateRestaurantDto } from "./dtos/create-restaurant.dto";
import { UpdateRestaurantDto } from "./dtos/update-restaurant.dto";

@Resolver()
export class RestaurantResolver{
    constructor(private readonly restaurantService: RestaurantService) {}
    @Query(returns => [Restaurant])
    restaurants(): Promise<Restaurant[]> {
        return this.restaurantService.getAll();
    }

    @Mutation(returns => Boolean)
    async createRestaurant(@Args('input') createRestaurantDto: CreateRestaurantDto): Promise<boolean> {
        try {
            await this.restaurantService.createRestaurant(createRestaurantDto);
            return true;
        } catch(e) {
            console.log(e);
            return false;
        }

    }

    @Mutation(returns => Boolean)
    async updateRestaurant(@Args() updateRestaurantDto: UpdateRestaurantDto) {
        try {
            await this.restaurantService.updateRestaurant(updateRestaurantDto);
            return true;
        } catch(e) {
            console.log(e);
            return false;
        }
    }
}