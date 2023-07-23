import styles from "./styles.module.scss";
import { DndSetting } from "@/core/models/entities/dnd_setting";
import { useEffect, useState } from "react";
import { Droppable } from "@/core/components/dnd/droppable";
import { WrapperDndContext } from "@/core/components/dnd/wrapper_dnd_context";
import { Draggable } from "@/core/components/dnd/draggable";
import { SimpleQuestion } from "@/core/models/entities/question";

export function PairTextsWithImagesExercise({
  isFormLocked,
  exercise,
  resetSwitch,
}: {
  isFormLocked: boolean;
  exercise: SimpleQuestion[];
  resetSwitch: boolean;
}) {
  const [dndSetting, setDndSetting] = useState<DndSetting>(new DndSetting());

  useEffect(() => {
    setDndSetting(dndSetting.reset());
  }, [resetSwitch]);

  useEffect(() => {
    const answersWithKeys = new Map(
      exercise.map(({ answer, question }, i) => {
        return [`${i}-${question}`, answer];
      })
    );
    setDndSetting(new DndSetting({ answersWithKeys }));
  }, [exercise]);

  return (
    <WrapperDndContext
      disabled={isFormLocked}
      dndSetting={dndSetting}
      setDndSetting={setDndSetting}
    >
      <section aria-label="soru kartları" className={styles["question-cards"]}>
        {exercise.map((item, index) => {
          const { question, answer } = item;
          const blankKey = `${index}-${question}`;
          const boardItemEntry =
            dndSetting.getBoardItemContainingTheLocation(blankKey);
          const isCorrect = dndSetting.check(blankKey);

          return (
            <div className={`simple-card`} key={index}>
              <img
                alt="soru fotoğrafı"
                src={`${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_IMAGE_BASE_URL}/${question}`}
              />
              {
                <Droppable
                  className="full-width"
                  status={
                    isFormLocked ? (isCorrect ? "success" : "error") : "neutral"
                  }
                  disabled={isFormLocked}
                  key={blankKey}
                  blankKey={blankKey}
                >
                  {boardItemEntry && (
                    <Draggable
                      status={
                        isFormLocked
                          ? isCorrect
                            ? "success"
                            : "error"
                          : "neutral"
                      }
                      styleChip={{ width: "100%" }}
                      styleContainer={{ width: "100%" }}
                      disabled={isFormLocked}
                      boardItemEntry={boardItemEntry}
                    />
                  )}
                </Droppable>
              }
            </div>
          );
        })}
      </section>
    </WrapperDndContext>
  );
}
