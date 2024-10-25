numbers <- c(3, 5, 8, 10, 12)

dump("numbers", file = "numbers.R")

rm(numbers)

ls() 

source("numbers.R")

print(numbers)
