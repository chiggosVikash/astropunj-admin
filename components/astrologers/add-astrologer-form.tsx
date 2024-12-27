"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import  useImageStore from "@/stores/image-store";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCallback, useState,useEffect } from "react";
import { ImageUpload } from "./image-upload";
import useCategoryStore from "@/stores/category-store";
import useAstrologerStore from "@/stores/astrologer-store";
import { saveImage } from "@/lib/saveImage";

const formSchema = z.object({
  category: z.string().min(1, "Category is required"),
  astrologerName: z
    .string()
    .min(2, "Astrologer name must be at least 2 characters"),
  profileName: z.string().min(2, "Profile name must be at least 2 characters"),
  image: z.string().min(1, "Profile image is required"),
  mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  expertise: z.string().min(1, "Expertise is required"),
  language: z.string().min(1, "Language is required"),
  experience: z.string().min(1, "Experience is required"),
  ratePerMin: z.string().min(1, "Rate per minute is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

// const categories = [
//   "Vedic Astrology",
//   "Tarot Reading",
//   "Numerology",
//   "Palmistry",
//   "Vastu",
// ];

const languages = [
  "English",
  "Hindi",
  "Bengali",
  "Tamil",
  "Telugu",
  "Marathi",
  "Gujarati",
];

interface AddAstrologerFormProps {
  onSuccess: () => void;
}

export function AddAstrologerForm({ onSuccess }: AddAstrologerFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {categories,getCategories} = useCategoryStore();

  const {saveAstrologer} = useAstrologerStore();
  const { imageFile } = useImageStore();

  const saveAstrologerFunc = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log("Save astrologer function called");
      if(!imageFile){
        throw new Error("Profile image is required");
      }

      const imageUrl = await saveImage(imageFile);
      console.log("Uploaded image url",imageUrl);
      saveAstrologer({
        name: values.astrologerName,
        categoryId: values.category,
        profilePic: imageUrl,
        mobile: values.mobile,
        password: values.password,
        expertise: values.expertise.split(","),
        languages: values.language,
        experienceInYear: parseInt(values.experience),
        ratePerMinute: parseInt(values.ratePerMin),
        description: values.description
      })

    }catch(e){
      console.error("Error adding astrologer:", e);
    }

  }

  // create a server component to save image
  // const saveImage = async (image: File) => {
  //   'use server';
  //   cloudinary.config({
  //     cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  //     api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  //     api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET
  //   });

  //   return new Promise((resolve, reject) => {
  //     const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
  //       if (error) {
  //         reject(error);
  //       } else {
  //         resolve(result?.secure_url);
  //       }
  //     });

  //     image.arrayBuffer().then(arrayBuffer => {
  //       const imageBuffer = Buffer.from(arrayBuffer);
  //       uploadStream.end(imageBuffer);
  //     }).catch(reject);
  //   });
  // }
  

  const fetchCategories = useCallback(async() =>{
    // Fetch categories from the server
    await getCategories();
  },[getCategories]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      astrologerName: "",
      profileName: "",
      image: "",
      mobile: "",
      password: "",
      expertise: "",
      language: "",
      experience: "",
      ratePerMin: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      await saveAstrologerFunc(values);
      onSuccess();
    } catch (error) {
      console.error("Error adding astrologer:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className=" max-h-screen p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Picture and Input Fields */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center md:items-start">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Image</FormLabel>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isLoading}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id ?? ""}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="astrologerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Astrologer Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter astrologer name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="profileName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter profile name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter mobile number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expertise"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expertise</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Vedic Astrology, Tarot Reading"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {languages.map((language) => (
                          <SelectItem key={language} value={language}>
                            {language}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter experience (years)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ratePerMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rate per Minute (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter rate per minute"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter detailed description about the astrologer"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Astrologer"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

