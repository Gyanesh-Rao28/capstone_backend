import { Request, Response } from "express";
import prisma from '../../db';
import { createGoogleMeetLink } from '../../middlewares/google-auth';

// Create an assessment
export const createAssessment = async (req: Request, res: Response) => {
  try {
      const { groupId, title, description, deadline, startTime, endTime } = req.body;
      const facultyId = req.user?.faculty?.id;

      if (!facultyId) {
          return res.status(401).json({
              status: 'Unauthorized',
              message: 'Invalid Faculty Id',
          });
    } 
    

      const group = await prisma.group.findUnique({
          where: { id: groupId },
          include: { project: { include: { faculty: true } } },
      });

      if (!group || group.project.facultyId !== facultyId) {
          return res.status(403).json({
              status: 'Forbidden',
              message: 'You are not authorized to create an assessment for this group',
          });
      }

      // Generate Google Meet link
      const googleMeetLink = await createGoogleMeetLink(
          title,
          description,
          startTime,
          endTime
      );

      const assessment = await prisma.assessment.create({
          data: {
              groupId,
              facultyId,
              title,
              description,
              googleMeetLink,
              deadline: new Date(deadline),
          },
      });

      res.status(201).json({
          status: 'success',
          message: 'Assessment created successfully',
          data: assessment,
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({
          status: 'error',
          message: 'Internal server error: creating assessment',
      });
  }
};

// Get all assessments created by a faculty
export const getAssessmentsByFaculty = async (req: Request, res: Response) => {
  try {
    const facultyId = req.user?.faculty?.id;

    if (!facultyId) {
      return res.status(401).json({
        status: "Unauthorized",
        message: "Invalid Faculty Id",
      });
    }

    const assessments = await prisma.assessment.findMany({
      where: { facultyId },
      include: { group: true, submissions: true },
    });

    res.status(200).json({
      status: "success",
      data: assessments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal server error: fetching assessments",
    });
  }
};

// Grade a submission
export const gradeSubmission = async (req: Request, res: Response) => {
  try {
    const { submissionId, grade } = req.body;
    const facultyId = req.user?.faculty?.id;

    if (!facultyId) {
      return res.status(401).json({
        status: "Unauthorized",
        message: "Invalid Faculty Id",
      });
    }

    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: { assessment: true },
    });

    if (!submission || submission.assessment.facultyId !== facultyId) {
      return res.status(403).json({
        status: "Forbidden",
        message: "You are not authorized to grade this submission",
      });
    }

    const updatedSubmission = await prisma.submission.update({
      where: { id: submissionId },
      data: { grade },
    });

    res.status(200).json({
      status: "success",
      message: "Submission graded successfully",
      data: updatedSubmission,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal server error: grading submission",
    });
  }
};