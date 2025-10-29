// controllers/serviceController.js
import {Service} from "../models/service.model.js"

export const createService = async (req, res) => {
  try {
    const { category, title, description, price, availability, location } =req.body;

    const images = req.files?.map((file) => file.path) || [];

    const newService = new Service({
      providerId: req.user._id,
      category,
      title,
      description,
      price,
      availability,
      location,
      images,
    });

    const saved = await newService.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Failed to create service" });
  }
};
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().populate("providerId", "name email");
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch services" });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate(
      "providerId",
      "name email"
    );
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: "Error fetching service" });
  }
};

export const updateService = async (req, res) => {
  try {
    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update service" });
  }
};

export const deleteService = async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Service deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete service" });
  }
};
