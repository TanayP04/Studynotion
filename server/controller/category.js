const Category =require("../models/category");

exports.createCategory = async (req, res) => {
	try {
		const { name, description } = req.body;
		if (!name) {
			return res
				.status(400)
				.json({ success: false, message: "All fields are required" });
		}
		const CategorysDetails = await Category.create({
			name: name,
			description: description,
		});
		console.log(CategorysDetails);
		return res.status(200).json({
			success: true,
			message: "Categorys Created Successfully",
		});
	} catch (error) {
		return res.status(500).json({
			success: true,
			message: error.message,
		});
	}
};

exports.showAllCategories = async (req, res) => {
	try {
        console.log("INSIDE SHOW ALL CATEGORIES");
    const allCategorys = await Category.find({}, {
        name: true,
        description: true,
    });
		res.status(200).json({
			success: true,
			data: allCategorys,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

//categoryPageDetails 

exports.categoryPageDetails = async (req, res) => {
    try {
      const { categoryId } = req.body
      //console.log("PRINTING CATEGORY ID: ", categoryId);
      // Get courses for the specified category
      const selectedCategory = await Category.findById(categoryId)
        .populate({
          path: "courses",
        //  match: { status: "Published" },
       //   populate: "ratingAndReviews",
        })
        .exec()
  
      //console.log("SELECTED COURSE", selectedCategory)
      // Handle the case when the category is not found
      if (!selectedCategory) {
        console.log("Category not found.")
        return res
          .status(404)
          .json({ success: false, message: "Category not found" })
      }
      // Handle the case when there are no courses
    //   if (selectedCategory.courses.length === 0) {
    //     console.log("No courses found for the selected category.")
    //     return res.status(404).json({
    //       success: false,
    //       message: "No courses found for the selected category.",
    //     })
    //   }
  
      // Get courses for other categories
      const differentCategory = await Category.find({
        _id: { $ne: categoryId },
      })
        .populate({
          path: "courses",}).exec();

          //get top 5 selling courses




          //response
          return res.status(200).json({
            success: true,
            message: "Category page details fetched successfully",
            data: {
              selectedCategory,
              differentCategory,
              topsellingCourses
            },
          })
        
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }