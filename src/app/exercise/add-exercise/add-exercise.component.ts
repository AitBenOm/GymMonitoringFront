import {Component, Input, OnInit} from '@angular/core';
import {ExerciseModel} from '../exercise-model';
import {LoadsModel} from '../loads-model';
import {ExerciseService} from '../exercise.service';
import {ProgramService} from '../../program/program.service';
import {ProgramModel} from '../../program/program-model';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-add-exercise',
  templateUrl: './add-exercise.component.html',
  styleUrls: ['./add-exercise.component.css']
})
export class AddExerciseComponent implements OnInit {

  constructor(private exerciseService: ExerciseService, private router: Router) { }

  @Input() exercises: ExerciseModel[];
  @Input() idProgram: number;
program: ProgramModel;
  exerciseName = '';
  loadName = '';
  loadType: string = '';
  exerciseAdded = false;


  onAddExercise() {
   this.exerciseAdded = true;
  }
  onSaveExercise() {

    const exercise = new ExerciseModel(this.exerciseName, []);
    const load = new LoadsModel(this.loadName+" "+this.loadType, new Date());
    this.exerciseService.addExercise(exercise, this.idProgram.toString())
      .subscribe(
        (exerciseData: ExerciseModel) => {
          exercise.idExercise = exerciseData.idExercise;
          console.log(exerciseData);
          this.exerciseService.addLoad(load, exercise.idExercise.toString())
            .subscribe(
              (loadData: LoadsModel) => {
                console.log(loadData);
                this.exerciseService.onLoadUpdated.next(loadData);
              }, error2 => {console.log(error2); }
            );
        }, error2 => {
          console.log(error2);
        }
      );
    this.exerciseName = '';
    this.loadName = '';
    this.exerciseAdded = false;
   this.exerciseService.onExerciseAdded.next(exercise);
   this.router.navigate(['/program', this.idProgram]);
  }
  ngOnInit() {

  }

}
