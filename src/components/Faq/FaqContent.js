"use client";

import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";

const FaqContent = () => {
  return (
    <>
      <div className="faq-area ptb-100">
        <div className="container">
          <div className="section-title">
            <h2>Find Answer Of Your Questions</h2>
          </div>

          <Accordion className="accordion-list" preExpanded={["a"]}>
            <AccordionItem uuid="a">
              <AccordionItemHeading>
                <AccordionItemButton>
                  How We Quote For Web Design?
                </AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Egestas facilisis metus vitae mattis velit ac amet, mattis an
                  Quam eu aliquam quisque commodo feugiat placerat elit. Eget
                  mi, morbi tincidunt dolor. Placerat enim rid iculus idemer
                  feugiat faucibus non pulvinar tincidunt. Vulputate tincidunt
                  sed interdum interdum porta enim.
                </p>
              </AccordionItemPanel>
            </AccordionItem>

            <AccordionItem uuid="b">
              <AccordionItemHeading>
                <AccordionItemButton>
                  How To Book Online Appoinment?
                </AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Egestas facilisis metus vitae mattis velit ac amet, mattis an
                  Quam eu aliquam quisque commodo feugiat placerat elit. Eget
                  mi, morbi tincidunt dolor. Placerat enim rid iculus idemer
                  feugiat faucibus non pulvinar tincidunt. Vulputate tincidunt
                  sed interdum interdum porta enim.
                </p>
              </AccordionItemPanel>
            </AccordionItem>

            <AccordionItem uuid="c">
              <AccordionItemHeading>
                <AccordionItemButton>
                  How Adles Works For Design?
                </AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Egestas facilisis metus vitae mattis velit ac amet, mattis an
                  Quam eu aliquam quisque commodo feugiat placerat elit. Eget
                  mi, morbi tincidunt dolor. Placerat enim rid iculus idemer
                  feugiat faucibus non pulvinar tincidunt. Vulputate tincidunt
                  sed interdum interdum porta enim.
                </p>
              </AccordionItemPanel>
            </AccordionItem>

            <AccordionItem uuid="d">
              <AccordionItemHeading>
                <AccordionItemButton>
                  How We Quote For Web Design?
                </AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Egestas facilisis metus vitae mattis velit ac amet, mattis an
                  Quam eu aliquam quisque commodo feugiat placerat elit. Eget
                  mi, morbi tincidunt dolor. Placerat enim rid iculus idemer
                  feugiat faucibus non pulvinar tincidunt. Vulputate tincidunt
                  sed interdum interdum porta enim.
                </p>
              </AccordionItemPanel>
            </AccordionItem>

            <AccordionItem uuid="e">
              <AccordionItemHeading>
                <AccordionItemButton>
                  How To Book Online Appoinment?
                </AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Egestas facilisis metus vitae mattis velit ac amet, mattis an
                  Quam eu aliquam quisque commodo feugiat placerat elit. Eget
                  mi, morbi tincidunt dolor. Placerat enim rid iculus idemer
                  feugiat faucibus non pulvinar tincidunt. Vulputate tincidunt
                  sed interdum interdum porta enim.
                </p>
              </AccordionItemPanel>
            </AccordionItem>

            <AccordionItem uuid="f">
              <AccordionItemHeading>
                <AccordionItemButton>How To Add Listings?</AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Egestas facilisis metus vitae mattis velit ac amet, mattis an
                  Quam eu aliquam quisque commodo feugiat placerat elit. Eget
                  mi, morbi tincidunt dolor. Placerat enim rid iculus idemer
                  feugiat faucibus non pulvinar tincidunt. Vulputate tincidunt
                  sed interdum interdum porta enim.
                </p>
              </AccordionItemPanel>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </>
  );
};

export default FaqContent;
