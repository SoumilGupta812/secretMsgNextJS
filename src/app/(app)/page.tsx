"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react"; // Assuming you have an icon for messages
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/messages.json";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Home() {
  return (
    <>
      {/* outer wrapper copied from sign‑in page */}
      <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-95 mt-6">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-900 rounded-full mix-blend-multiply filter blur-3xl" />
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-900 rounded-full mix-blend-multiply filter blur-3xl" />
        </div>

        {/* central card/container */}
        <div className="relative bg-gray-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-3xl border border-indigo-500/30 hover:border-indigo-500/60 transition-colors">
          <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 text-white">
            <section className="text-center mb-8 md:mb-12">
              <h1 className="text-3xl md:text-5xl font-bold">
                Dive into the world of secrets
              </h1>
              <p className="mt-3 md:mt-4 text-base md:text-lg">
                Your gateway to sending and receiving secret messages with ease
                and security.
              </p>
            </section>

            <Carousel
              plugins={[Autoplay({ delay: 2000 })]}
              className="w-full max-w-lg md:max-w-xl"
            >
              <CarouselContent>
                {messages.map((message, index) => (
                  <CarouselItem key={index} className="p-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>{message.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                        <Mail className="flex-shrink-0" />
                        <div>
                          <p>{message.content}</p>
                          <p className="text-xs text-muted-foreground">
                            {message.received}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white border-0 font-semibold transition-colors"
                >
                  Get Started
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-indigo-500 text-stone-800 hover:text-stone-500 hover:bg-indigo-500 hover:border-indigo-600 font-semibold transition-colors"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
