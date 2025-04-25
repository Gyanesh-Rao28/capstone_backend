import { Request, Response } from "express";
import prisma from '../../db';

// Submit an assessment
export const submitAssessment = async (req: Request, res: Response) => {
  try {
    const { assessmentId, content, attachments } = req.body;
    const studentId = req.user?.student?.id;

    if (!studentId) {
      return res.status(401).json({
        status: "Unauthorized",
        message: "Invalid Student Id",
      });
    }

    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: { group: { include: { members: true } } },
    });

    if (!assessment) {
      return res.status(404).json({
        status: "Not Found",
        message: "Assessment not found",
      });
    }

    const isMember = assessment.group.members.some(
      (member) => member.studentId === studentId
    );

    if (!isMember) {
      return res.status(403).json({
        status: "Forbidden",
        message: "You are not authorized to submit for this assessment",
      });
    }

    const submission = await prisma.submission.create({
      data: {
        assessmentId,
        studentId,
        content,
        attachments,
      },
    });

    res.status(201).json({
      status: "success",
      message: "Submission created successfully",
      data: submission,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal server error: submitting assessment",
    });
  }
};

// Get all submissions by a student
export const getSubmissionsByStudent = async (req: Request, res: Response) => {
  try {
    const studentId = req.user?.student?.id;

    if (!studentId) {
      return res.status(401).json({
        status: "Unauthorized",
        message: "Invalid Student Id",
      });
    }

    const submissions = await prisma.submission.findMany({
      where: { studentId },
      include: { assessment: true },
    });

    res.status(200).json({
      status: "success",
      data: submissions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal server error: fetching submissions",
    });
  }
};