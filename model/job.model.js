module.exports = mongoose => {
    const JobListing = mongoose.model(
      "Jobs",
      new mongoose.Schema(
        {
            company: { type: String, required: true },
            logo: { type: String, required: true },
            new: { type: Boolean, required: true },
            featured: { type: Boolean, required: true },
            position: { type: String, required: true },
            role: { type: String, required: true },
            level: { type: String, required: true },
            postedAt: { type: String, required: true },
            contract: { type: String, required: true },
        },
        { timestamps: true }
      )
    );
  
    return JobListing;
  };