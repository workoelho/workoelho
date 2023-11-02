"use client";

import { ReactNode, useEffect, useRef } from "react";

import { ClassList } from "~/lib/client/ClassList";
import { Flex } from "~/components/Flex";
import { Brand } from "~/components/Brand";

import classes from "./style.module.css";

type Props = {
  className?: string;
  children?: ReactNode;
};

const unstickDelay = 2000;

export function Topbar({ className, children }: Props) {
  const classList = new ClassList(classes.topbar, className);
  const ref = useRef<HTMLElement>(null);
  const scrollTopRef = useRef(0);
  const timeoutRef = useRef(0);

  const onPointerEnter = () => {
    clearTimeout(timeoutRef.current);
  };

  const onPointerLeave = () => {
    timeoutRef.current = window.setTimeout(() => {
      ref.current?.classList.remove(classes.sticky);
    }, unstickDelay);
  };

  useEffect(() => {
    const handleScroll = (event: Event) => {
      if (document.documentElement.scrollTop > scrollTopRef.current) {
        ref.current?.classList.remove(classes.sticky);
      } else {
        ref.current?.classList.add(classes.sticky);
      }
      scrollTopRef.current = document.documentElement.scrollTop;

      clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        ref.current?.classList.remove(classes.sticky);
      }, unstickDelay);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(timeoutRef.current);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Flex
      as="nav"
      ref={ref}
      className={classList.toString()}
      gap="3rem"
      alignItems="center"
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <h1>
        <a href="/">
          <Brand />
        </a>
      </h1>

      {children}
    </Flex>
  );
}
