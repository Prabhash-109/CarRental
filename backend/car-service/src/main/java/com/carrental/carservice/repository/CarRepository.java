package com.carrental.carservice.repository;

import com.carrental.carservice.entity.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarRepository extends JpaRepository<Car, Long> {
    List<Car> findByStatus(String status);
    List<Car> findByAgentId(Long agentId);
    List<Car> findByBrand(String brand);
    List<Car> findByFuelType(String fuelType);
    List<Car> findByTransmission(String transmission);
    
    @Query("SELECT c FROM Car c WHERE c.status = 'AVAILABLE' AND " +
           "(:brand IS NULL OR c.brand = :brand) AND " +
           "(:fuelType IS NULL OR c.fuelType = :fuelType) AND " +
           "(:transmission IS NULL OR c.transmission = :transmission) AND " +
           "(:minPrice IS NULL OR c.rentPrice >= :minPrice) AND " +
           "(:maxPrice IS NULL OR c.rentPrice <= :maxPrice)")
    List<Car> findAvailableCarsWithFilters(@Param("brand") String brand,
                                          @Param("fuelType") String fuelType,
                                          @Param("transmission") String transmission,
                                          @Param("minPrice") Double minPrice,
                                          @Param("maxPrice") Double maxPrice);
}
